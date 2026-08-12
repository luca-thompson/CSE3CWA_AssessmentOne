import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function QuoteDetail() {
  const [quote, setQuote] = useState({});
  const [calculation, setCalculation] = useState({});
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    fetch(`/api/quotes/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuote(data.quote);
        setCalculation(data.calculation);
      })
      .catch(err => {
        console.error('Failed to fetch quote:', err);
      });
  }, [id]);

  return (
    <div>
      <h2>{quote.customer_name}</h2>

      {location.state?.saved && <p>Quote saved successfully.</p>}

      <p>Cover Type: {quote.cover_type}</p>
      <p>Hospital Cover: {quote.hospital_cover}</p>
      <p>Extras Cover: {quote.extras_cover}</p>
      <p>Payment Frequency: {quote.payment_frequency}</p>
      <p>Annual Discount: {quote.annual_discount}%</p>

      <p>Applicant 1: Age {quote.applicant1_age}, History {quote.applicant1_cover_history}</p>
      {quote.cover_type !== 'Single' && (
        <p>Applicant 2: Age {quote.applicant2_age}, History {quote.applicant2_cover_history}</p>
      )}

      {calculation.applicants && calculation.applicants.map(a => (
        <p key={a.number}>Applicant {a.number} LHC Loading: {a.lhcLoadingPercent}%</p>
      ))}

      {calculation.warnings && calculation.warnings.map((w, i) => (
        <p key={i}>Warning: {w}</p>
      ))}

      <p>Hospital Premium: ${calculation.hospitalCoverTotal}</p>
      <p>Extras Premium: ${calculation.extrasCoverTotal}</p>
      <p>Family Upgrade Fee: ${calculation.upgradeFee}</p>
      <p>Monthly Premium: ${calculation.monthlyTotal}</p>
      <p>Yearly Premium (Before Discount): ${calculation.yearlyPreDiscount}</p>
      <p>Yearly Premium (After Discount): ${calculation.yearlyPostDiscount}</p>

      <p>{calculation.lhcStatement}</p>

      <p>Notes: {quote.notes}</p>
    </div>
  );
}

export default QuoteDetail;