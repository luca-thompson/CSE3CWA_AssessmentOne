# CSE3CWA_AssessmentOne

### Installation

git clone https://github.com/luca-thompson/CSE3CWA_AssessmentOne.git

cd CSE3CWA_AssessmentOne
then in two *separate* terminals:

cd frontend
npm install
npm run dev

cd backend
npm install

### Usage/Running

in two *separate* terminals (from project root):

cd frontend
npm run dev

cd backend
npm run start

### Quote Calculation

Quotes are the sum of hospital and extras cover

**Hospital premium (per adult)**
Each adult's hospital tier price is multiplied by `(1 + their LHC loading)`.
- LHC loading = `(age − 30) × 2%`, but only if:
    - hospital cover is not "None", **and**
    - the applicant's cover history is "No", **and**
    - age > 30
- If cover history is "Yes" or "Not sure", loading is 0% (with "Not sure" triggering a warning that the quote may be inaccurate).
- If age ≤ 30, loading is 0% regardless of history.

**Hospital total** = sum of each adult's loaded hospital premium (1 adult for Single, 2 for Couple/Family).

**Extras total** = extras tier price × number of adults. Extras are never loaded.

**Family upgrade fee** = $30/month if cover type is Family, otherwise $0. This is a flat fee automatically added, dependent children are not priced

**Monthly premium** = hospital total + extras total + family fee.

**Yearly premium (before discount)** = monthly premium × 12.

**Yearly premium (after discount)** — only calculated if payment frequency is Yearly:
`yearly before discount × (1 − annual discount%)`.
Monthly payers never receive this discount.

### Family Cover Calculation

Family cover is priced as *2 adults*, exactly like Couple cover, plus the flat $30/month family upgrade fee. Each adult's hospital and extras premiums (including their own individual LHC loading, calculated separately per applicant) are calculated and summed as normal, then the $30 fee is added once at the end. Children are not entered into the system and are not priced individually — they're covered under the flat family fee.

### AI usage
The only GenAI tool I used for this assignment was Claude from Anthropic.
I used this tool mainly to assist with my own understanding of some concepts in full-stack web development, particularly with Express endpoints and vite proxy routing.
Beyond this I used it to create cURL POST requests before I had a functional backend.
I also used it to generate some demo code, that I adjusted, changed and hevily edited, for some React forms as my React knowledge was limited.
Regarding decision making I decided the architecture of the QuoteList page, calculateQuote module, the extraction of the backend POST/PUT validation into its own module and almost all the decisions around how the endpoints would be architected.
