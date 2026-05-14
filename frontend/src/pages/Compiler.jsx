import { useState, useEffect } from 'react';
import { compilerAPI } from '../services/api';
import { Play, Terminal } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Compiler.css';

const Compiler = () => {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, BitBattles!")');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await compilerAPI.execute(code);
      setOutput(response.data.output);
    } catch (err) {
      setError(err.error || err.message || 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compiler-page">
      <div className="compiler-header">
        <h1 className="compiler-title"><Terminal size={32} /> Python Compiler</h1>
        <p className="compiler-subtitle">Write and execute Python code in real-time</p>
      </div>

      <div className="compiler-layout">
        <Card className="editor-card">
          <div className="editor-header">
            <span className="editor-label">Code Editor</span>
            <Button onClick={handleRun} loading={loading} size="sm">
              <Play size={16} />
              Run Code
            </Button>
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </Card>

        <Card className="output-card">
          <div className="output-header">
            <span className="output-label">Output</span>
          </div>
          <div className="output-content">
            {loading && <div className="output-loading">Executing...</div>}
            {error && <div className="output-error">{error}</div>}
            {output && !error && <pre className="output-text">{output}</pre>}
            {!loading && !error && !output && (
              <div className="output-placeholder">Run your code to see the output here</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Compiler;
