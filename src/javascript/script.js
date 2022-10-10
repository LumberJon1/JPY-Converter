// element definitions
const usdTextEl = document.querySelector("#usd-text");
const jpyTextEl = document.querySelector("#jpy-text");
const calculateButtonEl = document.querySelector("#calculate");
const displayEl = document.querySelector("#display");

// Switch to tell what to calculate
let toUSD = true;

// Script to pull exchange rate data and store in localStorage

// Script to convert unix time to readable format

// Script to calculate the exchange rate
// If we cannot pull the data from online, display the last known exchange rate from localStorage

// Script to calculate either the JPY:USD or USD:JPY depending on which text box the user selected,
// and display it to the result div


// Event listeners...

// Set calculation mode on user click into JPY or USD box
usdTextEl.addEventListener("click", () => {
    toUSD = true;
    console.log("Converting from JPY to USD.")
});

jpyTextEl.addEventListener("click", () => {
    toUSD = false;
    console.log("Converting from USD to JPY.")
});

// Run calculation on click of calculate button