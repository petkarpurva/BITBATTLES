const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Chapter = require('../models/Chapter');
const Quiz = require('../models/Quiz');

// Load env vars
dotenv.config();

const chaptersData = [
  {
    title: 'Introduction to Python',
    description: 'Learn how to communicate with systems using Python basics. Topics: What is Python, print(), and Comments.',
    difficulty: 'Easy',
    difficultyColor: '#10B981',
    unit: 1,
    chapterNumber: 1,
    text: 'Welcome to the world of Python! In this chapter, you will learn the basics of how to write code and communicate with the system using print statements and comments.',
  },
  {
    title: 'Variables & Data Types',
    description: 'Store and manage data to control system behavior. Topics: Variables, int, string, float, boolean, Input/output.',
    difficulty: 'Easy-Medium',
    difficultyColor: '#F59E0B',
    unit: 1,
    chapterNumber: 2,
    text: 'Data is everything. In this chapter, we will learn how to use variables to store different types of data, such as numbers, text, and boolean values.',
  },
  {
    title: 'Control Flow',
    description: 'Make decisions and control program logic. Topics: if, else, conditions, boolean logic.',
    difficulty: 'Medium',
    difficultyColor: '#F59E0B',
    unit: 1,
    chapterNumber: 3,
    text: 'Programs need to make decisions. Here we will learn about if, elif, and else statements to control the flow of our code.',
  },
  {
    title: 'Loops & Iteration',
    description: 'Repeat actions with for and while loops.',
    difficulty: 'Medium',
    difficultyColor: '#F59E0B',
    unit: 1,
    chapterNumber: 4,
    text: 'Instead of writing the same code over and over, we can use loops to repeat actions automatically.',
  },
  {
    title: 'Functions & Modules',
    description: 'Create reusable blocks of code and utilize external modules.',
    difficulty: 'Hard',
    difficultyColor: '#EF4444',
    unit: 1,
    chapterNumber: 5,
    text: 'Functions allow us to organize our code into reusable blocks. Modules let us use code written by others.',
  },
  {
    title: 'Data Structures',
    description: 'Organize complex data with Lists and Dictionaries.',
    difficulty: 'Hard',
    difficultyColor: '#EF4444',
    unit: 1,
    chapterNumber: 6,
    text: 'When we have a lot of data, we need structures like Lists and Dictionaries to organize and process it efficiently.',
  }
];

const quizzesData = {
  1: [
    { question: "What does Python use to display output?", options: ["show()", "print()", "display()", "echo()"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: 'What will this code output?\nprint("Hello")', options: ['"Hello"', "Hello", "Error", "Nothing"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Which of the following is a comment?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: 2, xpReward: 50, difficulty: "Easy" },
    { question: "What is Python?", options: ["A database", "A programming language", "An operating system", "A browser"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "What is the data inside print() called?", options: ["Variable", "Argument", "Loop", "Function"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Which is the correct syntax?", options: ["print Hello", 'print("Hello")', 'echo("Hello")', "display Hello"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "What file extension is used for Python files?", options: [".py", ".python", ".pt", ".txt"], correctAnswer: 0, xpReward: 50, difficulty: "Easy" },
    { question: "Which symbol is used to enclose a string?", options: ["Quotes", "Parentheses", "Brackets", "Hashes"], correctAnswer: 0, xpReward: 50, difficulty: "Medium" },
    { question: "Who created Python?", options: ["Bill Gates", "Steve Jobs", "Guido van Rossum", "Linus Torvalds"], correctAnswer: 2, xpReward: 50, difficulty: "Medium" }
  ],
  2: [
    { question: "What is a variable in Python?", options: ["A box to store data", "A snake", "A loop", "A conditional"], correctAnswer: 0, xpReward: 50, difficulty: "Easy" },
    { question: "Which is a valid variable name?", options: ["1st_name", "first-name", "first_name", "first name"], correctAnswer: 2, xpReward: 50, difficulty: "Medium" },
    { question: "What data type is 42?", options: ["String", "Float", "Integer", "Boolean"], correctAnswer: 2, xpReward: 50, difficulty: "Easy" },
    { question: "What data type is 3.14?", options: ["String", "Float", "Integer", "Boolean"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "What data type is 'Hello'?", options: ["String", "Float", "Integer", "Boolean"], correctAnswer: 0, xpReward: 50, difficulty: "Easy" },
    { question: "What data type is True?", options: ["String", "Float", "Integer", "Boolean"], correctAnswer: 3, xpReward: 50, difficulty: "Easy" },
    { question: "How do you assign the value 5 to a variable x?", options: ["x == 5", "x = 5", "let x = 5", "int x = 5"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Which of the following cannot be used as a variable name?", options: ["my_var", "_my_var", "myVar", "if"], correctAnswer: 3, xpReward: 50, difficulty: "Medium" },
    { question: "What function can be used to check the type of a variable?", options: ["check()", "type()", "typeof", "print()"], correctAnswer: 1, xpReward: 50, difficulty: "Hard" }
  ],
  3: [
    { question: "Which statement checks a condition?", options: ["for", "if", "while", "else"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Which statement is executed if the 'if' condition is false?", options: ["elif", "then", "else", "catch"], correctAnswer: 2, xpReward: 50, difficulty: "Easy" },
    { question: "Which operator is used for checking equality?", options: ["=", "==", "===", "=>"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Which operator is used for 'not equal'?", options: ["!=", "<>", "!==", "not="], correctAnswer: 0, xpReward: 50, difficulty: "Medium" },
    { question: "What keyword is used to chain multiple conditions?", options: ["else if", "elseif", "elif", "then"], correctAnswer: 2, xpReward: 50, difficulty: "Medium" },
    { question: "What does 'and' do in a condition?", options: ["Requires both sides to be true", "Requires one side to be true", "Inverts the boolean", "Nothing"], correctAnswer: 0, xpReward: 50, difficulty: "Medium" },
    { question: "What does 'or' do in a condition?", options: ["Requires both sides to be true", "Requires one side to be true", "Inverts the boolean", "Nothing"], correctAnswer: 1, xpReward: 50, difficulty: "Medium" },
    { question: "Which of the following is evaluated first? (3 > 2) or (1 < 0)", options: ["The left side", "The right side", "Both simultaneously", "None"], correctAnswer: 0, xpReward: 50, difficulty: "Hard" },
    { question: "Python relies on what to define the scope of an 'if' block?", options: ["Brackets {}", "Parentheses ()", "Indentation", "Semicolons ;"], correctAnswer: 2, xpReward: 50, difficulty: "Hard" }
  ],
  4: [
    { question: "Which loop repeats a specific number of times?", options: ["while loop", "for loop", "do-while loop", "repeat loop"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Which loop repeats as long as a condition is true?", options: ["while loop", "for loop", "do-while loop", "repeat loop"], correctAnswer: 0, xpReward: 50, difficulty: "Easy" },
    { question: "What function generates a sequence of numbers?", options: ["sequence()", "list()", "range()", "generate()"], correctAnswer: 2, xpReward: 50, difficulty: "Medium" },
    { question: "What does 'break' do in a loop?", options: ["Pauses the loop", "Exits the loop entirely", "Skips to the next iteration", "Causes an error"], correctAnswer: 1, xpReward: 50, difficulty: "Medium" },
    { question: "What does 'continue' do in a loop?", options: ["Exits the loop", "Skips the rest of the current iteration", "Pauses the program", "Continues to the next function"], correctAnswer: 1, xpReward: 50, difficulty: "Hard" },
    { question: "Which is the correct syntax for a for loop?", options: ["for i in range(5):", "for (i=0; i<5; i++)", "for i to 5", "loop 5 times:"], correctAnswer: 0, xpReward: 50, difficulty: "Easy" },
    { question: "If range(3) is used, what numbers are generated?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3, 2, 1"], correctAnswer: 1, xpReward: 50, difficulty: "Medium" },
    { question: "An infinite loop occurs when...", options: ["You use a for loop", "The condition never becomes false", "You use the break keyword", "The computer runs out of memory"], correctAnswer: 1, xpReward: 50, difficulty: "Medium" },
    { question: "Which keyword is used to iterate over a list?", options: ["over", "in", "through", "each"], correctAnswer: 1, xpReward: 50, difficulty: "Hard" }
  ],
  5: [
    { question: "What keyword is used to define a function?", options: ["function", "def", "func", "define"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "How do you call a function named 'my_func'?", options: ["call my_func", "my_func", "my_func()", "run my_func"], correctAnswer: 2, xpReward: 50, difficulty: "Easy" },
    { question: "What keyword sends a value back from a function?", options: ["send", "output", "yield", "return"], correctAnswer: 3, xpReward: 50, difficulty: "Medium" },
    { question: "Information passed into a function is called...", options: ["Arguments", "Variables", "Classes", "Methods"], correctAnswer: 0, xpReward: 50, difficulty: "Medium" },
    { question: "Which keyword imports an external module?", options: ["include", "require", "import", "using"], correctAnswer: 2, xpReward: 50, difficulty: "Easy" },
    { question: "How do you import only 'sqrt' from the 'math' module?", options: ["import math.sqrt", "from math import sqrt", "include sqrt from math", "require math(sqrt)"], correctAnswer: 1, xpReward: 50, difficulty: "Hard" },
    { question: "What is a default parameter?", options: ["A parameter that cannot be changed", "A parameter that assumes a value if none is provided", "A parameter that causes an error", "A parameter without a name"], correctAnswer: 1, xpReward: 50, difficulty: "Hard" },
    { question: "Variables created inside a function are...", options: ["Global scope", "Local scope", "Module scope", "Class scope"], correctAnswer: 1, xpReward: 50, difficulty: "Medium" },
    { question: "What does the 'pass' keyword do?", options: ["Skips to the next iteration", "Exits the program", "Does nothing (placeholder)", "Returns True"], correctAnswer: 2, xpReward: 50, difficulty: "Hard" }
  ],
  6: [
    { question: "Which bracket type defines a List?", options: ["()", "{}", "[]", "<>"], correctAnswer: 2, xpReward: 50, difficulty: "Easy" },
    { question: "Which bracket type defines a Dictionary?", options: ["()", "{}", "[]", "<>"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "Lists are ordered and mutable. What does mutable mean?", options: ["Cannot be changed", "Can be changed", "Only contains numbers", "Cannot be sorted"], correctAnswer: 1, xpReward: 50, difficulty: "Medium" },
    { question: "Dictionaries store data as...", options: ["A sequence of items", "Key-Value pairs", "A grid of numbers", "A single string"], correctAnswer: 1, xpReward: 50, difficulty: "Easy" },
    { question: "How do you access the first element of a list 'my_list'?", options: ["my_list[1]", "my_list.first()", "my_list[0]", "my_list(0)"], correctAnswer: 2, xpReward: 50, difficulty: "Medium" },
    { question: "What method adds an item to the end of a list?", options: ["add()", "insert()", "push()", "append()"], correctAnswer: 3, xpReward: 50, difficulty: "Medium" },
    { question: "How do you access the value for key 'name' in a dictionary 'my_dict'?", options: ["my_dict[name]", 'my_dict["name"]', "my_dict.name", "my_dict(name)"], correctAnswer: 1, xpReward: 50, difficulty: "Hard" },
    { question: "Which bracket type defines a Tuple (immutable list)?", options: ["()", "{}", "[]", "<>"], correctAnswer: 0, xpReward: 50, difficulty: "Hard" },
    { question: "What function returns the number of items in a list?", options: ["size()", "length()", "len()", "count()"], correctAnswer: 2, xpReward: 50, difficulty: "Medium" }
  ]
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bitbattles';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Chapter.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing Chapters and Quizzes');

    // Insert Chapters
    const createdChapters = [];
    for (const chapterData of chaptersData) {
      const chapter = new Chapter(chapterData);
      await chapter.save();
      createdChapters.push(chapter);
      console.log(`Created Chapter: ${chapter.chapterNumber}`);
    }

    // Insert Quizzes
    for (const chapter of createdChapters) {
      const chapterQuizzes = quizzesData[chapter.chapterNumber];
      if (chapterQuizzes && chapterQuizzes.length > 0) {
        for (const quizData of chapterQuizzes) {
          const quiz = new Quiz({
            ...quizData,
            chapterId: chapter._id,
          });
          await quiz.save();
        }
        console.log(`Created Quizzes for Chapter ${chapter.chapterNumber}`);
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
