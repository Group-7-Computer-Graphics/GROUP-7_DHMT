import React from 'react';

interface UFOQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  options: string[];
  onAnswer: (index: number) => void;
}

export default function UFOQuizModal({ isOpen, onClose, question, options, onAnswer }: UFOQuizModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #00f3ff',
        color: 'white',
        maxWidth: '500px'
      }}>
        <h2>UFO Quiz</h2>
        <p>{question}</p>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px',
              backgroundColor: 'transparent',
              border: '1px solid #00f3ff',
              color: '#00f3ff',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {option}
          </button>
        ))}
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
}