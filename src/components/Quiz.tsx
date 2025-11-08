import React, { useState, useRef } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';

const Quiz: React.FC = () => {
  // Task 1: Use QuizCore to manage quiz state separately from the UI
  const quizCoreRef = useRef<QuizCore>(new QuizCore());
  const quizCore = quizCoreRef.current;
  
  // Only track UI state (selected answer) - QuizCore handles the rest
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // Task 3: Counter to force re-render when moving to next question
  const [questionCounter, setQuestionCounter] = useState(0);

  const handleOptionSelect = (option: string): void => {
    setSelectedAnswer(option);
  }

  const handleButtonClick = (): void => {
    // Task 3: Record the answer if one was selected
    if (selectedAnswer) {
      quizCore.answerQuestion(selectedAnswer);
    }
    
    // Check if there's a next question
    if (quizCore.hasNextQuestion()) {
      // Move to next question
      quizCore.nextQuestion();
      // Reset selection for next question
      setSelectedAnswer(null);
      // Increment counter to force re-render
      setQuestionCounter(prev => prev + 1);
    } else {
      // Last question - move past it to show completion screen
      quizCore.nextQuestion();
      setSelectedAnswer(null);
      setQuestionCounter(prev => prev + 1);
    }
  } 

  // Get current question from QuizCore instead of state
  const currentQuestion = quizCore.getCurrentQuestion();

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {quizCore.getScore()} out of {quizCore.getTotalQuestions()}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>
    
      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={`${option}-${questionCounter}`}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <button onClick={handleButtonClick}>
        {quizCore.hasNextQuestion() ? 'Next Question' : 'Submit'}
      </button>
    </div>
  );
};

export default Quiz;
