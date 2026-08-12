import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuoteList from './pages/QuoteList';
import QuoteDetail from './pages/QuoteDetail';
import QuoteForm from './pages/QuoteForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuoteList />} />
        //this one has to be ABOVE quotes/id, otherise new gets captured as id
        <Route path="/quotes/new" element={<QuoteForm />} />
        <Route path="/quotes/:id" element={<QuoteDetail/>} />
        <Route path="/quotes/:id/edit" element={<QuoteForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;