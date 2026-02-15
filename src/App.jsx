import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Study from './pages/Study'
import Exam from './pages/Exam'

export default function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study/:pool" element={<Study />} />
          <Route path="/exam/:pool" element={<Exam />} />
        </Routes>
      </main>
    </div>
  )
}
