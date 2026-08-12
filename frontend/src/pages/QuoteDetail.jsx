import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



function QuoteDetail() {
    const [quote, setQuote] = useState([])
    const { id } = useParams();

    useEffect(() => {
        fetch(`/quotes/${id}`)
        .then(res => res.json())
        .then(data => {
            setQuote(data)
        })
        .catch(err => {
            console.error('Failed to fetch quotes:', err);
        });
    }, []);

    return (
        <div>
            {quote.customer_name} : 
            {quote.id}
        </div>
        
    );
}

export default QuoteDetail;