import { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const QuizContext = createContext();

export function useQuiz() {
    return useContext(QuizContext);
}

export function QuizProvider({ children }) {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for quizzes collection
        const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const quizzesData = [];
            querySnapshot.forEach((doc) => {
                quizzesData.push({ id: doc.id, ...doc.data() });
            });
            setQuizzes(quizzesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching quizzes: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addQuiz = async (quizData) => {
        try {
            await addDoc(collection(db, "quizzes"), {
                ...quizData,
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteQuiz = async (id) => {
        try {
            await deleteDoc(doc(db, "quizzes", id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const updateQuiz = async (id, updatedData) => {
        try {
            const quizRef = doc(db, "quizzes", id);
            await updateDoc(quizRef, updatedData);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
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
        <QuizContext.Provider value={{ quizzes, addQuiz, deleteQuiz, updateQuiz, getQuiz, exportQuizzes, loading }}>
            {children}
        </QuizContext.Provider>
    );
}
