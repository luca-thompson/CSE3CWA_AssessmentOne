import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function QuoteForm() {

  const [quote, setQuote] = useState({
    customer_name: '',
    cover_type: 'Single',
    applicant1_age: '',
    applicant1_cover_history: 'Yes',
    applicant2_age: '',
    applicant2_cover_history: 'Yes',
    hospital_cover: 'None',
    extras_cover: 'None',
    payment_frequency: 'Monthly',
    annual_discount: 0,
    notes: '',
  });

  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/quotes/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuote(data.quote);
      })
      .catch(err => {
        console.error('quote fetch error: ', err);
      });
  }, [id]);

  function handleChange(e) {
    setQuote({ ...quote, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!quote.customer_name) {
      setError('Customer name is required.');
      return;
    }

    if (quote.applicant1_age < 18 || quote.applicant1_age > 100) {
      setError('Applicant 1 age must be between 18 and 100.');
      return;
    }

    if (quote.cover_type !== 'Single' && (!quote.applicant2_age || !quote.applicant2_cover_history)) {
      setError('Applicant 2 age and cover history are required.');
      return;
    }

    if (quote.annual_discount < 0 || quote.annual_discount > 10) {
      setError('Annual discount must be between 0 and 10.');
      return;
    }

    const url = id ? `/api/quotes/${id}` : '/api/quotes';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    })
      .then(res => res.json())
      .then(data => {
        const target = `/quotes/${id || data.id}`;
        console.log('navigating to:', target);
        navigate(target, { state: { saved: true } });
      })
      .catch(err => {
        console.error('quote save error: ', err);
        setError('Failed to save quote.');
      });
  }

  return (
    <div>
      <h2>{id ? 'Edit Quote' : 'New Quote'}</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name</label>
          <input name="customer_name" value={quote.customer_name} onChange={handleChange} />
        </div>

        <div>
          <label>Cover Type</label>
          <select name="cover_type" value={quote.cover_type} onChange={handleChange}>
            <option value="Single">Single</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
          </select>
        </div>

        <div>
          <label>Applicant 1 Age</label>
          <input type="number" name="applicant1_age" value={quote.applicant1_age} onChange={handleChange} />
        </div>

        <div>
          <label>Applicant 1 Cover History</label>
          <select name="applicant1_cover_history" value={quote.applicant1_cover_history} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not sure">Not sure</option>
          </select>
        </div>

        {quote.cover_type !== 'Single' && (
          <>
            <div>
              <label>Applicant 2 Age</label>
              <input type="number" name="applicant2_age" value={quote.applicant2_age} onChange={handleChange} />
            </div>

            <div>
              <label>Applicant 2 Cover History</label>
              <select name="applicant2_cover_history" value={quote.applicant2_cover_history} onChange={handleChange}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label>Hospital Cover</label>
          <select name="hospital_cover" value={quote.hospital_cover} onChange={handleChange}>
            <option value="None">None</option>
            <option value="Basic">Basic</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        <div>
          <label>Extras Cover</label>
          <select name="extras_cover" value={quote.extras_cover} onChange={handleChange}>
            <option value="None">None</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div>
          <label>Payment Frequency</label>
          <select name="payment_frequency" value={quote.payment_frequency} onChange={handleChange}>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {quote.payment_frequency === 'Yearly' && (
          <div>
            <label>Annual Discount (%)</label>
            <input type="number" name="annual_discount" value={quote.annual_discount} onChange={handleChange} />
          </div>
        )}

        <div>
          <label>Notes</label>
          <textarea name="notes" value={quote.notes} onChange={handleChange} />
        </div>

        <button type="submit">{id ? 'Update Quote' : 'Create Quote'}</button>
      </form>
    </div>
  );
}

export default QuoteForm;