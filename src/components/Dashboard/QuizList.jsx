import { useQuiz } from '../../context/QuizContext';
import { Trash2, Play, Edit, Download } from 'lucide-react';

export default function QuizList({ onCreate, onPlay, onEdit }) {
    const { quizzes, deleteQuiz, exportQuizzes } = useQuiz();

    if (quizzes.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <p>No quizzes yet. Create your first one!</p>
                <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={onCreate}
                >
                    Create New Quiz
                </button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button className="btn btn-secondary" onClick={exportQuizzes}>
                    <Download size={16} /> Export Quizzes
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{quiz.title}</h3>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                backgroundColor: '#e0e7ff',
                                color: '#4338ca'
                            }}>
                                {quiz.questions.length} Questions
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={() => onPlay(quiz.id)}
                            >
                                <Play size={16} /> Play
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => onEdit(quiz.id)}
                                aria-label="Edit"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                                onClick={() => deleteQuiz(quiz.id)}
                                aria-label="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
