import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App.jsx'
import { QuizProvider } from './context/QuizContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </StrictMode>,
)
