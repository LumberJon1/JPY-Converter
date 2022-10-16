// element definitions
const dateHeadingEl = document.querySelector("#date-heading");
const currentTimeEl = document.querySelector("#current-timestamp");
const timestampEl = document.querySelector("#timestamp");
const exchangeFormEl = document.querySelector("#exchange-form");
const usdTextEl = document.querySelector("#usd-text");
const jpyTextEl = document.querySelector("#jpy-text");
const calculateButtonEl = document.querySelector("#calculate");
const displayEl = document.querySelector("#display");
const comparisonEl = document.querySelector("#comparison-display");
const exchangeRateEl = document.querySelector("#exch-display");

// Switch to tell what to calculate
let toUSD = true;

// Current exchange rate (expressed in USD:JPY. Use reciprocal for JPY:USD.)
let exchangeRate = 2;

// Script to convert unix time to readable format
const populateTime = (type="timestamp") => {

    let date = new Date(Date.now());
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    // Format month
    switch(month) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
    }

    switch(day) {
        case 1:
        case 21:
        case 31:
            day = day+"st";
            break;
        case 2:
        case 22:
            day = day+"nd";
            break;
        case 3:
        case 23:
            day = day+"rd";
            break;
        default:
            day = day+"th";
    }

    let dateHeading = `${month} ${day}, ${year}`;
    let currentTime = `Current time: ${hour}:${minute} (Local)`;
    let timestamp = `${month} ${day}, ${year} at ${hour}:${minute}`

    if (type == "dateHeading") {
        return dateHeading;
    }
    else if (type == "currentTime") {
        return currentTime;
    }
    else if (type == "timeStamp") {
        return timestamp;
    }
    else {
        console.log("Invalid parameter for function.");
    }
}


// Script to pull exchange rate data and store in localStorage
// Exchange rate data courtesy of exchangerate.host API
const callExchangeRate = () => {

    const requestURL = `https://api.exchangerate.host/convert?from=USD&to=JPY&places=6`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function() {

        // Capture HTTP response status
        let responseStatus = request.status;
        console.log(responseStatus);

        // Break out of the function and initiate a localStorage request if the rsponse != 200
        if (responseStatus != 200) {
            exchangeRate = JSON.parse(localStorage.getItem("exchangeRate"));
            timestampEl.textContent = JSON.parse(localStorage.getItem("timeStamp"));
        }
        else {

            let response = request.response;
            // Set exchange rate to the result of the API query
            exchangeRate = response.result;
      
            // Set the timestamp for the header
            let timestamp = populateTime("timeStamp");
            timestampEl.textContent = timestamp;

            // Set localStorage entry with the updated exchange rate
            localStorage.setItem("exchangeRate", JSON.stringify(exchangeRate));
            localStorage.setItem("timeStamp", JSON.stringify(timestamp));

            // Display the exchange rate
            exchangeRateEl.textContent = "$1:"+exchangeRate.toFixed(2);
        }
    }
}


// Script to calculate either the JPY:USD or USD:JPY depending on which text box the user selected,
// and display it to the result div
const calculateCost = () => {
    
    // Check whether toUSD is false
    if (toUSD === false) {
        let jpyFormatter = new Intl.NumberFormat("en-us", {
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "JPY"
        });
        let usdFormatter = new Intl.NumberFormat("en-us", {
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "USD"
        });
        let result = parseFloat(usdTextEl.value.trim());
        // Display the original amount for comparison
        comparisonEl.textContent = usdFormatter.format(result);
        
        // Calculate the converted amount
        result = jpyFormatter.format(result * exchangeRate);
        displayEl.textContent = result;
        
    }
    else if (toUSD === true) {
        let usdFormatter = new Intl.NumberFormat("en-us", {
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "USD"
        });
        let jpyFormatter = new Intl.NumberFormat("en-us", {
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            currency: "JPY"
        });
        let result = parseFloat(jpyTextEl.value.trim());
        // Display the original amount for comparison
        comparisonEl.textContent = jpyFormatter.format(result);

        // Calculate the converted amount
        result = usdFormatter.format(result * (1 / exchangeRate));
        displayEl.textContent = result;
    }
}


// Event listeners...

// Set calculation mode on user click into JPY or USD box
usdTextEl.addEventListener("click", () => {
    toUSD = false;
});

jpyTextEl.addEventListener("click", () => {
    toUSD = true;
});

// Run calculation on click of calculate button

exchangeFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    calculateCost();
    usdTextEl.value = "";
    jpyTextEl.value = "";
});

// Assign the date and time on load
dateHeadingEl.textContent = populateTime("dateHeading");
currentTimeEl.textContent = populateTime("currentTime");

callExchangeRate();