import { Routes, Route } from 'react-router-dom';
import CloudDisplay from './pages/CloudDisplay';
import SubmitFeedback from './pages/SubmitFeedback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CloudDisplay />} />
      <Route path="/submit" element={<SubmitFeedback />} />
    </Routes>
  );
}

export default App;
