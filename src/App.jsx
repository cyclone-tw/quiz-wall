import { useState } from 'react'
import QuizList from './components/Dashboard/QuizList'
import QuizEditor from './components/Editor/QuizEditor'
import GamePlayer from './components/Player/GamePlayer'
import QRCodeModal from './components/Shared/QRCodeModal'
import { useQuiz } from './context/QuizContext'
import { QrCode } from 'lucide-react'

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, editor, player
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [showQR, setShowQR] = useState(false);

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
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={goHome}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            QuizWall
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Create and Play Interactive Quizzes</p>
        </div>
        <button
          className="btn btn-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
          onClick={() => setShowQR(true)}
        >
          <QrCode size={20} />
        </button>
      </header>

      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />

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
