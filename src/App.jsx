import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeleteAccount from './components/DeleteAccount';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<div>Welcome to Sabjifal</div>} />
          
          {/* Delete account route */}
          <Route path="/delete-account" element={<DeleteAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
