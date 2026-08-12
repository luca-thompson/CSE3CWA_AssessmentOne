import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuoteList from './pages/QuoteList';
import QuoteDetail from './pages/QuoteDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuoteList />} />
        <Route path="/quotes/:id" element={<QuoteDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;