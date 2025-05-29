import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';

import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
      </Routes>
    </Router>
  )
}

export default App
