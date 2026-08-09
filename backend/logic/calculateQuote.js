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

let yearlyDiscountPercentage = 8;
let familyUpgradeFee = 30;


function calculateLHCPercentage(adult){
    if (adult.LHC == "yes"){
        return 0;
    }

    if (adult.LHC == "unsure"){
        return null;
    }

    if (adult.age <= 30){
        return 0;
    }

    return ((adult.age - 30) * 2);

}

function calculateQuote(input){

    let accuracyErrorFlag = 0
    
    let hospitalCoverTotal = 0;
    let extrasCoverTotal = 0;
    let LHCPercentage = 0;


    for (let i = 0; i < input.adults.length; i++) {
        

        if (input.adults[i].age == null){
            console.log("null adult")
            continue;
        }

        LHCPercentage = calculateLHCPercentage(input.adults[i])

        if (LHCPercentage == null){

            accuracyErrorFlag = 1

            hospitalCoverTotal += coverPrices.get(input.hospitalCoverLevel.toLowerCase());
        }
        else{
            hospitalCoverTotal += coverPrices.get(input.hospitalCoverLevel.toLowerCase()) * (1 + (LHCPercentage * 0.01));
        }

        extrasCoverTotal += extrasPrices.get(input.extrasCoverLevel.toLowerCase())
    }

    let upgradeFee = 0;

    if (input.coverType.toLowerCase() == "family"){
        upgradeFee = familyUpgradeFee;
    }

    let monthlyTotal = hospitalCoverTotal + extrasCoverTotal + upgradeFee;
    let yearlyPreDiscount = monthlyTotal * 12;
    let yearlyPostDiscount = (yearlyPreDiscount) * (1 - (yearlyDiscountPercentage * 0.01));

    return { hospitalCoverTotal, extrasCoverTotal, upgradeFee, monthlyTotal, yearlyPreDiscount, yearlyPostDiscount};
}

