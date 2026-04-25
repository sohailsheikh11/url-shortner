import { useState } from 'react'
import UrlShortner from './components/UrlShortner'
import AuthPage from './components/Auth';
import { Routes, Route } from "react-router-dom";

import './App.css'

function App() {

  

  

  return (
    
      

        <Routes>
          <Route path="/home" element={<AuthPage />} />
          <Route path="/dashboard" element={<UrlShortner />} />
        </Routes>
      
    
  )
}

export default App
