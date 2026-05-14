const { validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * @route   POST /api/compiler/execute
 * @desc    Execute Python code using local Node.js child_process
 * @access  Public
 */
const executeCode = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { code } = req.body;

    // Security: Basic validation
    if (!code || code.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Code cannot be empty' 
      });
    }

    // Since Piston API is offline for unauthorized users, we execute locally
    const filename = `script_${Date.now()}_${Math.floor(Math.random() * 1000)}.py`;
    const tempFilePath = path.join(os.tmpdir(), filename);

    // Save the user code to a temporary Python file
    await fs.writeFile(tempFilePath, code);

    try {
      // Execute the python script with a 5000ms timeout to prevent infinite loops (like `while True: pass`)
      const { stdout, stderr } = await execPromise(`python "${tempFilePath}"`, { timeout: 5000 });
      
      // Clean up the temporary file immediately
      await fs.unlink(tempFilePath).catch(e => console.error('Cleanup error:', e));

      res.json({
        success: true,
        message: 'Code executed successfully',
        data: {
          output: stdout || stderr || '(No output)',
          executionTime: '< 5s',
        },
      });

    } catch (execError) {
      // execPromise throws if exit code != 0, or if it times out
      await fs.unlink(tempFilePath).catch(e => console.error('Cleanup error:', e));

      let errorMessage = execError.stderr || execError.message || 'Unknown execution error';
      
      // Check for timeout
      if (execError.killed && execError.signal === 'SIGTERM') {
        errorMessage = 'Execution timed out (Max 5 seconds). Infinite loop detected?';
      }

      return res.status(400).json({
        success: false,
        message: 'Code execution failed',
        error: errorMessage,
      });
    }

  } catch (error) {
    console.error('Execute code error:', error.message || error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during local execution',
      error: error.message 
    });
  }
};

module.exports = {
  executeCode,
};
