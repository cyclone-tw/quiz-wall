import { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Plus, Trash2, Save, ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import MediaUploader from './MediaUploader';

export default function QuizEditor({ quizId, onSave, onCancel }) {
    const { getQuiz, addQuiz, updateQuiz } = useQuiz();

    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (quizId) {
            const quiz = getQuiz(quizId);
            if (quiz) {
                setTitle(quiz.title);
                setQuestions(quiz.questions);
            }
        } else {
            // Initialize with one empty question
            addQuestion();
        }
    }, [quizId]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: uuidv4(),
                type: 'multiple-choice',
                question: '',
                options: [
                    { id: uuidv4(), text: '', isCorrect: false },
                    { id: uuidv4(), text: '', isCorrect: false },
                ],
            },
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestionText = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].question = text;
        setQuestions(newQuestions);
    };

    const updateQuestionMedia = (index, media) => {
        const newQuestions = [...questions];
        newQuestions[index].media = media;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ id: uuidv4(), text: '', isCorrect: false, media: null }); // Initialize media for new option
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const updateOptionText = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = text;
        setQuestions(newQuestions);
    };

    const updateOptionMedia = (qIndex, oIndex, media) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].media = media;
        setQuestions(newQuestions);
    };

    const toggleCorrectOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // For multiple choice (single answer), uncheck others
        newQuestions[qIndex].options.forEach((opt, idx) => {
            opt.isCorrect = idx === oIndex;
        });
        setQuestions(newQuestions);
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a quiz title');
            return;
        }

        // Basic validation
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].question.trim()) {
                alert(`Question ${i + 1} is missing text`);
                return;
            }
            const hasCorrect = questions[i].options.some(o => o.isCorrect);
            if (!hasCorrect) {
                alert(`Question ${i + 1} needs a correct answer`);
                return;
            }
        }

        const quizData = {
            title,
            questions,
            type: 'multiple-choice', // Hardcoded for now
        };

        if (quizId) {
            updateQuiz(quizId, quizData);
        } else {
            addQuiz(quizData);
        }
        onSave();
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={onCancel}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{quizId ? 'Edit Quiz' : 'Create New Quiz'}</h2>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={16} /> Save Quiz
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Quiz Title</label>
                <input
                    className="input"
                    placeholder="Enter quiz title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {questions.map((q, qIndex) => (
                    <div key={q.id} className="card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Question {qIndex + 1}</span>
                            {questions.length > 1 && (
                                <button
                                    onClick={() => removeQuestion(qIndex)}
                                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                className="input"
                                placeholder="Type your question here..."
                                value={q.question}
                                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                style={{ marginBottom: '0.5rem' }}
                            />
                            <MediaUploader
                                media={q.media}
                                onUpdate={(media) => updateQuestionMedia(qIndex, media)}
                                label="Add Question Media"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {q.options.map((opt, oIndex) => (
                                <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => toggleCorrectOption(qIndex, oIndex)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: opt.isCorrect ? 'var(--success)' : 'var(--text-muted)',
                                            cursor: 'pointer'
                                        }}
                                        title="Mark as correct"
                                    >
                                        {opt.isCorrect ? <CheckCircle size={24} /> : <Circle size={24} />}
                                    </button>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            className="input"
                                            value={opt.text}
                                            onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            style={{ borderColor: opt.isCorrect ? 'var(--success)' : 'var(--border)' }}
                                        />
                                        <MediaUploader
                                            media={opt.media}
                                            onUpdate={(media) => updateOptionMedia(qIndex, oIndex, media)}
                                            label="Img/Audio"
                                        />
                                    </div>
                                    {q.options.length > 2 && (
                                        <button
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {q.options.length < 6 && (
                            <button
                                className="btn btn-secondary"
                                style={{ marginTop: '1rem', width: '100%' }}
                                onClick={() => addOption(qIndex)}
                            >
                                <Plus size={16} /> Add Option
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                className="btn btn-primary"
                style={{ marginTop: '2rem', width: '100%', padding: '1rem' }}
                onClick={addQuestion}
            >
                <Plus size={20} /> Add Question
            </button>
        </div>
    );
}
