// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResponsePage from './pages/ResponsePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1f2029] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header />
          <main >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/response" element={<ResponsePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App