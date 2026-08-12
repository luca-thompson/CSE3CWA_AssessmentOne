import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function QuoteList() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch('/api/quotes')
      .then(res => res.json())
      .then(data => {
        setQuotes(data);
      })
      .catch(err => {
        console.error('failed to fetch quotes:', err);
      });
  }, []);

  return (
    <div>
      <div>
        <Link to={`/quotes/new`}>Create New Quote</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Cover Type</th>
            <th>Hospital Cover</th>
            <th>Extras Cover</th>
            <th>Payment Frequency</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map(q => (
            <tr key={q.id}>
                <td>{q.customer_name}</td>
                <td>{q.cover_type}</td>
                <td>{q.hospital_cover}</td>
                <td>{q.extras_cover}</td>
                <td>{q.payment_frequency}</td>
                <td>{q.created_at}</td>
                <td><Link to={`/quotes/${q.id}`}>View</Link></td>
                <td><Link to={`/quotes/${q.id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}

export default QuoteList;