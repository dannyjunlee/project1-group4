// DEPENDENCIES
// API - Polygon.io (for stock data)
// var polygonURL = "https://api.polygon.io/v1/open-close/AAPL/2022-10-11?adjusted=true&apiKey=2MYBRhMYEstgP3SY5prEcQsMFsRc40TO"
// fetch(polygonURL)
//     .then(function (response) {
//         return response.json();
//     })

//     .then(function (data) {
//         console.log(data);
//     })

// API - SerpAPI (for Google Trends)

var searchInputEl = $("#stock-name");
var searchButtonEl = $(".pure-button");
var recentSearchListEl = $("#stock-list");

// DATA
// Datahub.io JSON - list of all stocks in S&P 500 with stock name, ticker, and sector
// var datahubURL = "https://pkgstore.datahub.io/core/s-and-p-500-companies/constituents_json/data/297344d8dc0a9d86b8d107449c851cc8/constituents_json.json"
// fetch(datahubURL)
//     .then(function (response) {
//         return response.json();
//     })

//     .then(function (data) {
//         console.log(data);
//     })

// FUNCTION
// Fetch stock/sector data from Datahub.io JSON
// If it is single stock name/ticker, use Polygon.io API to retrieve stock data
// Use SerpAPI to get investor sentiment on the stock/sector
// Save search to local storage and append as re-searchable list item underneath search

// function that makes a fetch call to datahub API and gets list of S&P 500 stocks
async function getSP500Data() {
    var datahubURL = "https://pkgstore.datahub.io/core/s-and-p-500-companies/constituents_json/data/297344d8dc0a9d86b8d107449c851cc8/constituents_json.json"

    var response = await fetch(datahubURL);
    return await response.json();
    
}

// function that takes in a sector, searches datahub data and returns a list of stocks that match that sector

function getSymbolsMatchingSector(searchSector, sp500Data) {
    console.log(searchSector, sp500Data);
    var matches = [];
    for (var i = 0; i < sp500Data.length; i++) {
        if (sp500Data[i].Sector === searchSector) {
            matches.push(sp500Data[i].Symbol);
        }
    }
    return matches;
}

// function that takes in a stock symbol, makes a fetch call to polygon API, and returns data on that stock
async function getStockDataBySymbol(symbol) {
    // Make sure date will update dynamically too
    var polygonURL = "https://api.polygon.io/v1/open-close/" + symbol + "/2022-10-11?adjusted=true&apiKey=FlToY1WBGF5kiYC7dn85gxRAV3UviYAQ"


    var response = await fetch(polygonURL);
    var data = await response.json();
    console.log(data);
    return data;
};

function showStockData(data) {
    var liTicker = $("<li>").text(data.symbol);
    var liOpen = $("<li>").text("$" + data.open);
    var liHigh = $("<li>").text("$" + data.high);
    var liLow = $("<li>").text("$" + data.low);
    var liClose = $("<li>").text("$" + data.close);
    // FORMAT!!!
    var liVolume = $("<li>").text(data.volume);
    $("#current").append(liTicker);
    $("#current").append(liOpen);
    $("#current").append(liHigh);
    $("#current").append(liLow);
    $("#current").append(liClose);
    $("#current").append(liVolume);

    // Append to recent searches
    var liTickerBtn = $("<li>").text(data.symbol);
    recentSearchListEl.append(liTickerBtn);

    // Show related stocks in related stocks section
    // Probably use for loop to go through datahub.io dataset for matching sectors
    // Or use getSymbolsMatchingSector() function
};

// Function to clear page and reset to default values upon update of page information
function clearPage() {
    searchInputEl.text("Search");
}

async function init () {
    // If localstorage getitem (key) returns undefined,
    // Call getsp500data function
    // otherwise it's ready to be used
    var sp500Data =  await getSP500Data();
    console.log(sp500Data);

    // var searchResults = getSymbolsMatchingSector('Industrials', sp500Data);
    // var stockData = {
    //     exp: Date.now() + (300 * 1000),
    //     data: sp500Data
    // }

    // for (let symbol of searchResults) {

    //     var stockData = await getStockDataBySymbol(symbol);
    //     // rate limited 5 requests / min
    //     console.log(stockData); 
    // }

};

// USER INTERACTION
// User inputs stock or sector name and presses “Search”
searchButtonEl.on("click", async function(event) {
    event.preventDefault();
    console.log(searchInputEl.val());
    var symbol = searchInputEl.val();
    var data = await getStockDataBySymbol(symbol);
    console.log("Symbol");
    showStockData(data);
});

// INITIALIZATION
init();

