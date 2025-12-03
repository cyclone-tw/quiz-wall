import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Plus, Trash2, Save, ArrowLeft, CheckCircle, Circle, Upload, FileDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import MediaUploader from './MediaUploader';
import Papa from 'papaparse';

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

    const handleCSVImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const parsedQuestions = results.data.map(row => {
                        // Expected columns: Question, Option 1, Option 2, Option 3, Option 4, Correct Answer (1-4), Image URL, Audio URL
                        // Flexible matching for headers
                        const qText = row['Question'] || row['question'] || '';
                        if (!qText) return null;

                        const options = [];
                        for (let i = 1; i <= 6; i++) {
                            const optText = row[`Option ${i}`] || row[`option ${i}`] || row[`Option${i}`];
                            if (optText) {
                                options.push({
                                    id: uuidv4(),
                                    text: optText,
                                    isCorrect: false,
                                    media: null
                                });
                            }
                        }

                        // Handle Correct Answer
                        const correctIndex = parseInt(row['Correct Answer'] || row['correct answer'] || row['Correct'] || '1') - 1;
                        if (options[correctIndex]) {
                            options[correctIndex].isCorrect = true;
                        } else if (options.length > 0) {
                            options[0].isCorrect = true; // Fallback
                        }

                        // Handle Media
                        let media = null;
                        const imgUrl = row['Image URL'] || row['image url'] || row['Image'];
                        const audioUrl = row['Audio URL'] || row['audio url'] || row['Audio'];

                        if (imgUrl) media = { type: 'image', url: imgUrl };
                        else if (audioUrl) media = { type: 'audio', url: audioUrl };

                        return {
                            id: uuidv4(),
                            type: 'multiple-choice',
                            question: qText,
                            options: options.length >= 2 ? options : [
                                ...options,
                                { id: uuidv4(), text: 'Option 2', isCorrect: false, media: null }
                            ],
                            media: media
                        };
                    }).filter(q => q !== null);

                    if (parsedQuestions.length > 0) {
                        setQuestions(prev => [...prev, ...parsedQuestions]);
                        alert(`Imported ${parsedQuestions.length} questions!`);
                    } else {
                        alert('No valid questions found in CSV.');
                    }
                } catch (error) {
                    console.error('CSV Import Error:', error);
                    alert('Error parsing CSV. Please check the format.');
                }
            }
        });
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={onCancel}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{quizId ? 'Edit Quiz' : 'Create New Quiz'}</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                        href="./template.csv"
                        download="quiz-template.csv"
                        className="btn btn-secondary"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FileDown size={16} /> Template
                    </a>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                        <Upload size={16} /> Import CSV
                        <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSVImport} />
                    </label>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={16} /> Save Quiz
                    </button>
                </div>
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
