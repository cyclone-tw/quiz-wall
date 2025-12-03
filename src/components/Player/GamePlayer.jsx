import { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';

export default function GamePlayer({ quizId, onExit }) {
    const { getQuiz } = useQuiz();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('loading'); // loading, playing, feedback, finished
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        if (quizId) {
            const q = getQuiz(quizId);
            if (q) {
                // Shuffle questions or options could go here
                setQuiz(q);
                setGameState('playing');
            }
        }
    }, [quizId]);

    const handleAnswer = (optionIndex) => {
        if (gameState !== 'playing') return;

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correct = currentQuestion.options[optionIndex].isCorrect;

        setSelectedOption(optionIndex);
        setIsCorrect(correct);
        setGameState('feedback');

        if (correct) {
            setScore(score + 1);
        }

        // Auto advance after delay
        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setGameState('playing');
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setGameState('finished');
            }
        }, 1500);
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameState('playing');
        setSelectedOption(null);
        setIsCorrect(null);
    };

    if (!quiz) return <div>Loading...</div>;

    if (gameState === 'finished') {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <Trophy size={64} style={{ color: 'var(--warning)', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Quiz Completed!</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                        You scored <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{score}</span> out of {quiz.questions.length}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={restartGame}>
                            <RefreshCw size={18} /> Play Again
                        </button>
                        <button className="btn btn-secondary" onClick={onExit}>
                            <ArrowLeft size={18} /> Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={onExit}>
                    <ArrowLeft size={16} /> Exit
                </button>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Question {currentQuestionIndex + 1} / {quiz.questions.length}
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    Score: {score}
                </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                {currentQuestion.media && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        {currentQuestion.media.type === 'image' ? (
                            <img
                                src={currentQuestion.media.url}
                                alt="Question"
                                style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: 'var(--radius-md)' }}
                            />
                        ) : (
                            <audio controls src={currentQuestion.media.url} autoPlay />
                        )}
                    </div>
                )}
                <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
                    {currentQuestion.question}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {currentQuestion.options.map((opt, index) => {
                        let style = {
                            padding: '1.5rem',
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            border: '2px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-card)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        };

                        if (gameState === 'feedback') {
                            if (index === selectedOption) {
                                style.borderColor = isCorrect ? 'var(--success)' : 'var(--error)';
                                style.background = isCorrect ? '#dcfce7' : '#fee2e2';
                            } else if (opt.isCorrect && !isCorrect) {
                                // Show correct answer if wrong was selected
                                style.borderColor = 'var(--success)';
                                style.background = '#dcfce7';
                            } else {
                                style.opacity = 0.5;
                            }
                        } else {
                            // Normal state hover
                            style[':hover'] = { borderColor: 'var(--primary)', transform: 'translateY(-2px)' };
                        }

                        return (
                            <button
                                key={opt.id}
                                onClick={() => handleAnswer(index)}
                                disabled={gameState === 'feedback'}
                                style={style}
                                className="option-btn" // For hover effect via CSS if needed, but inline style limitation
                            >
                                {opt.media && (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        {opt.media.type === 'image' ? (
                                            <img
                                                src={opt.media.url}
                                                alt="Option"
                                                style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: 'var(--radius-sm)' }}
                                            />
                                        ) : (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <audio controls src={opt.media.url} style={{ maxWidth: '100%' }} />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div>{opt.text}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '2rem', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    background: 'var(--primary)',
                    width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%`,
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
}
