import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { ArrowLeft, RefreshCw, Trophy, Download, Check, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function GamePlayer({ quizId, onExit }) {
    const { getQuiz } = useQuiz();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('loading'); // loading, setup, playing, feedback, finished
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]); // Store history: { questionId, isCorrect, selectedOptionIndex }
    const [isRandomized, setIsRandomized] = useState(false);
    const [playingQuestions, setPlayingQuestions] = useState([]);
    const resultRef = useRef(null);

    useEffect(() => {
        if (quizId) {
            const q = getQuiz(quizId);
            if (q) {
                setQuiz(q);
                setPlayingQuestions(q.questions);
                setGameState('setup');
            }
        }
    }, [quizId, getQuiz]);

    const startGame = () => {
        let questionsToPlay = [...quiz.questions];
        if (isRandomized) {
            questionsToPlay = questionsToPlay.sort(() => Math.random() - 0.5);
        }
        setPlayingQuestions(questionsToPlay);
        setGameState('playing');
    };

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

        setUserAnswers(prev => [...prev, {
            questionId: currentQuestion.id,
            isCorrect: correct,
            selectedOptionIndex: optionIndex
        }]);

        // Auto advance after delay
        setTimeout(() => {
            if (currentQuestionIndex < playingQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setGameState('playing');
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setGameState('finished');
            }
        }, 2000); // 2 seconds feedback
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameState('setup');
        setSelectedOption(null);
        setIsCorrect(null);
        setUserAnswers([]);
    };

    const handleDownloadResult = async () => {
        if (resultRef.current) {
            try {
                const canvas = await html2canvas(resultRef.current);
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = url;
                link.download = `quiz-result-${new Date().getTime()}.png`;
                link.click();
            } catch (error) {
                console.error('Download failed:', error);
            }
        }
    };

    if (!quiz) return <div>Loading...</div>;

    if (gameState === 'setup') {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{quiz.title}</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        {quiz.questions.length} Questions
                    </p>

                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="randomize"
                            checked={isRandomized}
                            onChange={(e) => setIsRandomized(e.target.checked)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="randomize" style={{ fontSize: '1.1rem', cursor: 'pointer' }}>Randomize Question Order</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={startGame} style={{ padding: '0.75rem 2rem', fontSize: '1.2rem' }}>
                            Start Quiz
                        </button>
                        <button className="btn btn-secondary" onClick={onExit}>
                            <ArrowLeft size={18} /> Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem' }}>
                <div ref={resultRef} className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', background: 'white' }}>
                    <Trophy size={64} style={{ color: 'var(--warning)', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Quiz Completed!</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                        You scored <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{score}</span> out of {playingQuestions.length}
                    </p>

                    <div style={{ textAlign: 'left', marginBottom: '2rem', maxHeight: '500px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Detailed Results</h3>
                        {playingQuestions.map((q, index) => {
                            const answer = userAnswers.find(a => a.questionId === q.id);
                            const isCorrect = answer?.isCorrect;
                            const selectedIndex = answer?.selectedOptionIndex;

                            return (
                                <div key={q.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            background: isCorrect ? 'var(--success)' : 'var(--error)',
                                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {isCorrect ? <Check size={14} /> : <X size={14} />}
                                        </div>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Question {index + 1}</span>
                                    </div>

                                    <div style={{ marginLeft: '2rem' }}>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{q.question}</p>
                                        {q.media && q.media.type === 'image' && (
                                            <img src={q.media.url} alt="Question" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', marginBottom: '0.5rem', objectFit: 'cover' }} />
                                        )}

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {q.options.map((opt, optIndex) => {
                                                let bgColor = 'var(--surface)';
                                                let borderColor = 'var(--border)';
                                                let textColor = 'var(--text-main)';

                                                if (opt.isCorrect) {
                                                    bgColor = 'rgba(34, 197, 94, 0.1)';
                                                    borderColor = 'var(--success)';
                                                    textColor = 'var(--success)';
                                                } else if (selectedIndex === optIndex && !isCorrect) {
                                                    bgColor = 'rgba(239, 68, 68, 0.1)';
                                                    borderColor = 'var(--error)';
                                                    textColor = 'var(--error)';
                                                }

                                                return (
                                                    <div key={opt.id} style={{
                                                        padding: '0.5rem',
                                                        border: `1px solid ${borderColor}`,
                                                        borderRadius: 'var(--radius-sm)',
                                                        background: bgColor,
                                                        color: textColor,
                                                        fontSize: '0.9rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        {opt.media && opt.media.type === 'image' && (
                                                            <img src={opt.media.url} alt="Option" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                                                        )}
                                                        <span>{opt.text}</span>
                                                        {opt.isCorrect && <Check size={14} style={{ marginLeft: 'auto' }} />}
                                                        {selectedIndex === optIndex && !isCorrect && <X size={14} style={{ marginLeft: 'auto' }} />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={restartGame}>
                            <RefreshCw size={18} /> Play Again
                        </button>
                        <button className="btn btn-secondary" onClick={handleDownloadResult}>
                            <Download size={18} /> Download Result
                        </button>
                        <button className="btn btn-secondary" onClick={onExit}>
                            <ArrowLeft size={18} /> Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = playingQuestions[currentQuestionIndex];
    if (!currentQuestion) return null;

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
                            color: 'var(--text-main)',
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
