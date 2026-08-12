function validateQuoteInput(input) {
    const {
    customer_name,
    cover_type,
    applicant1_age,
    applicant1_cover_history,
    applicant2_age,
    applicant2_cover_history,
    hospital_cover,
    extras_cover,
    payment_frequency,
    annual_discount,
    notes
  } = input;


    if (!customer_name || !cover_type || !hospital_cover || !extras_cover || !payment_frequency) {
        return { isValid: false, httpCode: 400, message: 'some fields null\n' };
    }

    if (applicant1_age < 18 || applicant1_age > 100) {
        return { isValid: false, httpCode: 400, message: 'Applicant 1 age outside of range\n' };
    }

    if (cover_type !== 'Single') {
        if (!applicant2_age || !applicant2_cover_history) {
            return { isValid: false, httpCode: 400, message: 'Missing applicant two age or history\n' };
        }
        if (applicant2_age < 18 || applicant2_age > 100) {
            return { isValid: false, httpCode: 400, message: 'Applicant 2 age outside of range\n' };
        }


        if (annual_discount < 0 || annual_discount > 10) {
            return { isValid: false, httpCode: 400, message: 'Annual discount percentage must be between 0 and 10\n' };
        }
    }

    return { isValid: true };
}

module.exports = { validateQuoteInput };