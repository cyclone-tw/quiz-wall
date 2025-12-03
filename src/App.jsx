import { useState } from 'react'
import QuizList from './components/Dashboard/QuizList'
import QuizEditor from './components/Editor/QuizEditor'
import GamePlayer from './components/Player/GamePlayer'
import { useQuiz } from './context/QuizContext'

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, editor, player
  const [activeQuizId, setActiveQuizId] = useState(null);

  const handleCreate = () => {
    setActiveQuizId(null);
    setView('editor');
  };

  const handleEdit = (id) => {
    setActiveQuizId(id);
    setView('editor');
  };

  const handlePlay = (id) => {
    setActiveQuizId(id);
    setView('player');
  };

  const goHome = () => {
    setView('dashboard');
    setActiveQuizId(null);
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center', cursor: 'pointer' }} onClick={goHome}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          QuizWall
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Create and Play Interactive Quizzes</p>
      </header>

      <main className="animate-fade-in">
        {view === 'dashboard' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>My Quizzes</h2>
              <button className="btn btn-primary" onClick={handleCreate}>+ Create Quiz</button>
            </div>
            <QuizList onCreate={handleCreate} onPlay={handlePlay} onEdit={handleEdit} />
          </>
        )}

        {view === 'editor' && (
          <QuizEditor
            quizId={activeQuizId}
            onSave={goHome}
            onCancel={goHome}
          />
        )}

        {view === 'player' && (
          <GamePlayer
            quizId={activeQuizId}
            onExit={goHome}
          />
        )}
      </main>
    </div>
  )
}

export default App
