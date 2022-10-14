// element definitions
const dateHeadingEl = document.querySelector("#date-heading");
const currentTimeEl = document.querySelector("#current-timestamp");
const timestampEl = document.querySelector("#timestamp");
const exchangeFormEl = document.querySelector("#exchange-form");
const usdTextEl = document.querySelector("#usd-text");
const jpyTextEl = document.querySelector("#jpy-text");
const calculateButtonEl = document.querySelector("#calculate");
const displayEl = document.querySelector("#display");

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
            console.log(month);
            break;
        case 1:
            month = "February";
            console.log(month);
            break;
        case 2:
            month = "March";
            console.log(month);
            break;
        case 3:
            month = "April";
            console.log(month);
            break;
        case 4:
            month = "May";
            console.log(month);
            break;
        case 5:
            month = "June";
            console.log(month);
            break;
        case 6:
            month = "July";
            console.log(month);
            break;
        case 7:
            month = "August";
            console.log(month);
            break;
        case 8:
            month = "September";
            console.log(month);
            break;
        case 9:
            month = "October";
            console.log(month);
            break;
        case 10:
            month = "November";
            console.log(month);
            break;
        case 11:
            month = "December";
            console.log(month);
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


// TODO: If we cannot pull the data from online, display the last known exchange rate from localStorage

// Script to pull exchange rate data and store in localStorage
// Exchange rate data courtesy of exchangerate.host API
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

        // Capture HTTP response status
        let responseStatus = request.status;
        console.log(responseStatus);

        // Break out of the function and initiate a localStorage request if the rsponse != 200
        if (responseStatus != 200) {
            console.log("No current exchange rate data available.  Pulling from local storage...");
            exchangeRate = localStorage.getItem("");
            timestampEl.textContent = localStorage.getItem("");
        }
        else {

            let response = request.response;
            // Set exchange rate to the result of the API query
            exchangeRate = response.result;
      
            // Set the timestamp for the header
            let timestamp = populateTime("timeStamp");
            timestampEl.textContent = timestamp;

            // Set localStorage entry with the updated exchange rate
            
        }
    }
}

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

// Assign the date and time on load
dateHeadingEl.textContent = populateTime("dateHeading");
currentTimeEl.textContent = populateTime("currentTime");

callExchangeRate();