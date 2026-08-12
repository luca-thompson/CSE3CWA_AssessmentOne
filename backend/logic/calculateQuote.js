//business rules/logic

const coverPrices = new Map();
coverPrices.set("none", 0);
coverPrices.set("basic", 90);
coverPrices.set("bronze", 120);
coverPrices.set("silver", 160);
coverPrices.set("gold", 220);

const extrasPrices = new Map();
extrasPrices.set("none", 0);
extrasPrices.set("basic", 25);
extrasPrices.set("standard", 45);
extrasPrices.set("premium", 70);

let familyUpgradeFee = 30;

const lhcStatement = "Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.";

function calculateLHCPercentage(age, coverHistory) {
    if (coverHistory == "yes") {
        return 0;
    }

    if (coverHistory == "not sure") {
        return null;
    }

    if (age <= 30) {
        return 0;
    }

    return ((age - 30) * 2);
}

function calculateQuote(row) {

    const adults = [
        { age: row.applicant1_age, coverHistory: row.applicant1_cover_history?.toLowerCase() },
    ];

    if (row.cover_type.toLowerCase() == "couple" || row.cover_type.toLowerCase() == "family") {
        adults.push({ age: row.applicant2_age, coverHistory: row.applicant2_cover_history?.toLowerCase() });
    }

    let hospitalCoverTotal = 0;
    let extrasCoverTotal = 0;
    let warnings = [];
    let applicantResults = [];

    for (let i = 0; i < adults.length; i++) {

        const LHCPercentage = calculateLHCPercentage(adults[i].age, adults[i].coverHistory);
        let appliedPercentage = 0;

        if (LHCPercentage == null) {
            // not sure so add warning
            appliedPercentage = 0;
            hospitalCoverTotal += coverPrices.get(row.hospital_cover.toLowerCase());
            warnings.push(`Applicant ${i + 1}: Cover history is unknown, LHC loading has not been applied. This quote may be inaccurate.`);
        } else {
            appliedPercentage = LHCPercentage;
            hospitalCoverTotal += coverPrices.get(row.hospital_cover.toLowerCase()) * (1 + (LHCPercentage * 0.01));
        }

        applicantResults.push({
            number: i + 1,
            age: adults[i].age,
            coverHistory: adults[i].coverHistory,
            lhcLoadingPercent: appliedPercentage,
        });

        extrasCoverTotal += extrasPrices.get(row.extras_cover.toLowerCase());
    }

    let upgradeFee = 0;

    if (row.cover_type.toLowerCase() == "family") {
        upgradeFee = familyUpgradeFee;
    }

    let monthlyTotal = hospitalCoverTotal + extrasCoverTotal + upgradeFee;
    let yearlyPreDiscount = monthlyTotal * 12;

    let yearlyPostDiscount = null;
    if (row.payment_frequency.toLowerCase() == "yearly") {
        yearlyPostDiscount = yearlyPreDiscount * (1 - ((row.annual_discount ?? 0) * 0.01));
    }

    return {
        hospitalCoverTotal,
        extrasCoverTotal,
        upgradeFee,
        monthlyTotal,
        yearlyPreDiscount,
        yearlyPostDiscount,
        applicants: applicantResults,
        warnings,
        lhcStatement,
    };
}

module.exports = { calculateQuote };