// element definitions
const exchangeFormEl = document.querySelector("#exchange-form");
const usdTextEl = document.querySelector("#usd-text");
const jpyTextEl = document.querySelector("#jpy-text");
const calculateButtonEl = document.querySelector("#calculate");
const displayEl = document.querySelector("#display");

// Switch to tell what to calculate
let toUSD = true;

// Current exchange rate (expressed in USD:JPY. Use reciprocal for JPY:USD.)
let exchangeRate = 2;

// Script to pull exchange rate data and store in localStorage
// If we cannot pull the data from online, display the last known exchange rate from localStorage
const callExchangeRate = () => {

    // if (toUSD === true) {
    //     from = "JPY";
    //     to = "USD";
    // }
    // else {
    //     from = "USD";
    //     to = "JPY";
    // }

    const requestURL = `https://api.exchangerate.host/convert?from=USD&to=JPY&places=6`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function() {
      let response = request.response;

      // Set exchange rate to the result of the API query
      exchangeRate = response.result;
    }
}

// Script to convert unix time to readable format

// Script to calculate either the JPY:USD or USD:JPY depending on which text box the user selected,
// and display it to the result div
const calculateCost = () => {
    console.log("Calculating cost of item...");
    // Check whether toUSD is false
    if (toUSD === false) {
        let formatter = new Intl.NumberFormat("en-us", {
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "JPY"
        });
        let result = parseFloat(usdTextEl.value.trim());
        result = formatter.format(result * exchangeRate);
        displayEl.textContent = result;
    }
    else if (toUSD === true) {
        let formatter = new Intl.NumberFormat("en-us", {
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "USD"
        });
        let result = parseFloat(jpyTextEl.value.trim());
        result = formatter.format(result * (1 / exchangeRate));
        displayEl.textContent = result;
        
    }
    // Clear the inputs
}


// Event listeners...

// Set calculation mode on user click into JPY or USD box
usdTextEl.addEventListener("click", () => {
    toUSD = false;
    console.log("Converting from USD to JPY.")
});

jpyTextEl.addEventListener("click", () => {
    toUSD = true;
    console.log("Converting from JPY to USD.")
});

// Run calculation on click of calculate button

exchangeFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    calculateCost();
    usdTextEl.value = "";
    jpyTextEl.value = "";
});

callExchangeRate();