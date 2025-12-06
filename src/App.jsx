import { useState, useEffect } from 'react'
import QuizList from './components/Dashboard/QuizList'
import QuizEditor from './components/Editor/QuizEditor'
import GamePlayer from './components/Player/GamePlayer'
import QRCodeModal from './components/Shared/QRCodeModal'
import { useQuiz } from './context/QuizContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginModal from './components/Shared/LoginModal'
import { QrCode, Moon, Sun, LogIn, LogOut } from 'lucide-react'

function AppContent() {
  const [view, setView] = useState('dashboard'); // dashboard, editor, player
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('quizwall-theme') || 'light');
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quizwall-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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

  const handleLogout = async () => {
    try {
      await logout();
      goHome();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={goHome}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            QuizWall
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Create and Play Interactive Quizzes</p>
        </div>
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem' }}>
          {user ? (
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              title="Logout (Teacher Mode)"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setShowLogin(true)}
              title="Teacher Login"
            >
              <LogIn size={20} />
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowQR(true)}
            title="Share QR Code"
          >
            <QrCode size={20} />
          </button>
        </div>
      </header>

      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <main className="animate-fade-in">
        {view === 'dashboard' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>My Quizzes</h2>
              {user && <button className="btn btn-primary" onClick={handleCreate}>+ Create Quiz</button>}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
