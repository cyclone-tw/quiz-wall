import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const QuizContext = createContext();

export function useQuiz() {
    return useContext(QuizContext);
}

export function QuizProvider({ children }) {
    const [quizzes, setQuizzes] = useState(() => {
        const saved = localStorage.getItem('quizwall-data');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        // Load static data if empty or just to merge (optional strategy: merge unique IDs)
        const loadStaticData = async () => {
            try {
                const response = await fetch('./default-quizzes.json');
                if (response.ok) {
                    const staticQuizzes = await response.json();
                    setQuizzes(prev => {
                        // Merge static quizzes, avoiding duplicates by ID
                        const existingIds = new Set(prev.map(q => q.id));
                        const newQuizzes = staticQuizzes.filter(q => !existingIds.has(q.id));
                        return [...prev, ...newQuizzes];
                    });
                }
            } catch (error) {
                console.log('No static quizzes found or error loading');
            }
        };
        loadStaticData();
    }, []);

    useEffect(() => {
        localStorage.setItem('quizwall-data', JSON.stringify(quizzes));
    }, [quizzes]);

    const addQuiz = (quizData) => {
        const newQuiz = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...quizData,
        };
        setQuizzes((prev) => [newQuiz, ...prev]);
    };

    const deleteQuiz = (id) => {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
    };

    const updateQuiz = (id, updatedData) => {
        setQuizzes((prev) =>
            prev.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
        );
    };

    const getQuiz = (id) => {
        return quizzes.find((q) => q.id === id);
    };

    const exportQuizzes = () => {
        const dataStr = JSON.stringify(quizzes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-quizzes.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <QuizContext.Provider value={{ quizzes, addQuiz, deleteQuiz, updateQuiz, getQuiz, exportQuizzes }}>
            {children}
        </QuizContext.Provider>
    );
}
