$(document).ready(function () {
    // global variables
    // api key for OpenWeatherMap
    var apiKey = "5d761404b078d6abc22673d93b124a79";
    // local storage saved searches
    var savedSearches = JSON.parse(localStorage.getItem("savedWeatherSearches")) || [];
    // array for search location data
    var searchLocation = {};

    // find user's location by IP on page load
    $.ajax({
        url: "https://api.ipify.org/?format=json",
        dataType: 'JSON',
    }).then(function (data) {
        console.log("user ip", data.ip);

        var url = `https://geolocation-db.com/json/${data.ip}}&APIKEY=${apiKey}`;

        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            response = JSON.parse(response);            
            
            // get city and state from Geolocation API
            var searchString = response.city + "," + response.state; 

            // convert to object and set global variable
            processLocation(searchString)
            
            // call search weather
            search();
        })

    });

    // display list of saved searches as clickable buttons
    setViewed();

    // event listener for text input search button
    $("#searchBtn").click(function () {

        // convert input text to object and set global variable
        processLocation($("#locationText").val())

        // call search weather for location
        search();

    });


    // event listener for history buttons
    $(document).on("click", ".saved-search", function () {

        // convert text to object and set global variable
        processLocation($(this).text());        

        // call search weather for location
        search()
    })

    // get current weather condition for location. send coordinate object containing latitude and longitude
    function getCurrentWeather(coords) {

        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=imperial`
        // var queryURL = `https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=${apiKey}&lat=${coords.latitude}&lon=${coords.longitude}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);


            // declare 3 equal columns for displaying current info
            var div1 = $("<div>").addClass("col-md-4").addClass("currentTitle");
            var div2 = $("<div>").addClass("col-md-4").addClass("currentIcon");
            var div3 = $("<div>").addClass("col-md-4");


            // div1 holds date and weather description
            var containerDiv1 = $("<div>");

            $("<h3>").text(formatDate(response.current.dt, "long")).appendTo(containerDiv1);

            $("<h3>").text(response.current.weather[0].description).appendTo(containerDiv1);

            containerDiv1.appendTo(div1);


            // div2 holds icon for weather type
            $("<img>").attr("src", `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@4x.png`).attr("alt", response.current.weather[0].description).attr("id", "mainIcon").appendTo(div2);

            // div3 holds weather details
            var containerDiv = $("<div>").addClass("currentInfo")

            $("<strong>").text("Current Temperature: ").appendTo(containerDiv);
            $(containerDiv).append(response.current.temp)
            $("<br>").appendTo(containerDiv);

            $("<strong>").text("Feels Like: ").appendTo(containerDiv);
            $(containerDiv).append(response.current.feels_like)
            $("<br>").appendTo(containerDiv);

            $("<strong>").text("Cloud Cover: ").appendTo(containerDiv);
            $(containerDiv).append(response.current.clouds + "%")
            $("<br>").appendTo(containerDiv);

            $("<strong>").text("Wind: ").appendTo(containerDiv);
            $(containerDiv).append(response.current.wind_speed + " MPH")
            $("<br>").appendTo(containerDiv);

            $("<strong>").text("Humidity: ").appendTo(containerDiv);
            $(containerDiv).append(response.current.humidity + "%")
            $("<br>").appendTo(containerDiv);

            $("<strong>").text("UV Index: ").appendTo(containerDiv);
            $(containerDiv).append(response.current.uvi)
            $("<br>").appendTo(containerDiv);

            div3.append(containerDiv);

            // place 3 columns in row
            $("#currentWeatherDiv").append(div1)
            $("#currentWeatherDiv").append(div2)
            $("#currentWeatherDiv").append(div3)

            // place row on page
            $("body").css("background-image", "url(" + getBackground(response.current.weather[0].main) + ")");

        });
    }

    function getForecast(coords) {

        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=imperial`

        // async call to get weather info
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            
            var weatherArr = response.daily;

            // get 5 days of info for forecast
            for(var i=0; i<5; i++){

                // create container for single day forecast
                var forecastDayDiv = $("<div>");
                forecastDayDiv.addClass("forecast-day");

                // add weather info
                $("<h3>").text(formatDate(weatherArr.dt, "short")).appendTo(forecastDayDiv);
                $("<h3>").text(weatherArr.weather[0].description).appendTo(forecastDayDiv);
                
                $("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherArr.weather[0].icon}@2x.png`).attr("alt", weatherArr.weather[0].description).appendTo(forecastDayDiv);
                $("<br>").appendTo(forecastDayDiv);
                
                $("<strong>").text("Low Temp: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(weatherArr.temp.min)
                $("<br>").appendTo(forecastDayDiv);
                
                $("<strong>").text("High Temp: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(weatherArr.temp.max)
                $("<br>").appendTo(forecastDayDiv);
                
                $("<strong>").text("Cloud Cover: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(weatherArr.clouds + "%")
                $("<br>").appendTo(forecastDayDiv);
                
                $("<strong>").text("Wind: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(weatherArr.wind_speed + " MPH")
                $("<br>").appendTo(forecastDayDiv);

                $("<strong>").text("Humidity: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(weatherArr.humidity + "%")
                $("<br>").appendTo(forecastDayDiv);

                $("<strong>").text("UV Index: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(weatherArr.uvi + "%")
                $("<br>").appendTo(forecastDayDiv);

                $("<strong>").text("Precipitation: ").appendTo(forecastDayDiv);
                $(forecastDayDiv).append(Math.floor(weatherArr.pop * 100) + "%")
                $("<br>").appendTo(forecastDayDiv);

                // add day to display
                $("#forecastDiv").append(forecastDayDiv);

            }
        });
    }

    // create buttons from local storage search history
    function setViewed() {
        
        // create button-like div
        $("#pastSearchesDiv").html("");
        
        // loop through each item in local storage array
        savedSearches.forEach(element => {
            
            // add info to div
            var newDiv = $("<div>");
            newDiv.text(element.city);
            if(element.state){
                newDiv.append(", " + element.state)
            }
            if(element.country){
                newDiv.append(", " + element.country)
            }
            newDiv.attr("class", "saved-search");

            // add new div to page
            $("#pastSearchesDiv").append(newDiv);
        });
    }

    // create date formatter with option for short format or long format
    function formatDate(num, length) {

        // convert seconds from epoch to date
        var myDate = new Date(num * 1000);

        // format date
        if (length === "short") {
            return myDate.toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit' });
        }
        return myDate.toLocaleDateString('en-US', { weekday: 'long', year: "numeric", month: '2-digit', day: '2-digit' });
    }

    // search function gets coords from cities-min.js lookup and calls 2 functions to get and display data
    // function set to search from global location object with required city, optional state, and optional country
    // after finding match, resets city, state, and country properties
    function search() {

        // clear current data to allow appending
        $("#currentWeatherDiv").html("")
        $("#forecastDiv").html("")

        var coords = {};

        // if city, state, and country are declared
        if (searchLocation.state && searchLocation.country) {
            // search list for match
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].name.toLowerCase() === searchLocation.city.toLowerCase() && cities[i].state_code.toLowerCase() === searchLocation.state.toLowerCase() && cities[i].country_code.toLowerCase() === searchLocation.country.toLowerCase()){
                    // set object values
                    coords.longitude = cities[i].longitude;
                    coords.latitude = cities[i].latitude;
                    searchLocation.city = cities[i].name;
                    searchLocation.state = cities[i].state_code;
                    searchLocation.country = cities[i].country_code;                    
                }
            }
        }
        // only city and state are declared
        else if (searchLocation.state) {
            // search list for match
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].name.toLowerCase() === searchLocation.city.toLowerCase() && cities[i].state_code.toLowerCase() === searchLocation.state.toLowerCase()){
                    // set object values
                    coords.longitude = cities[i].longitude;
                    coords.latitude = cities[i].latitude;
                    searchLocation.city = cities[i].name;
                    searchLocation.state = cities[i].state_code;
                    searchLocation.country = cities[i].country_code;
                }
            }
            
        } 
        // only city is declared
        else{
            // search for city match
            for (var i = 0; i < cities.length; i++) {                
                if (cities[i].name.toLowerCase() === searchLocation.city.toLowerCase()){
                    // set object values
                    coords.longitude = cities[i].longitude;
                    coords.latitude = cities[i].latitude;
                    searchLocation.city = cities[i].name;
                    searchLocation.state = cities[i].state_code;
                    searchLocation.country = cities[i].country_code;
                }
            }
        }

        // if match is found call api searches
        if(coords.latitude && coords.longitude){            
            getCurrentWeather(coords);  
            getForecast(coords);

            $("#currentH2").text(`Current Weather For ${searchLocation.city}, ${searchLocation.state}, ${searchLocation.country}`);
            $("#forecastH2").text(`Forecast For ${searchLocation.city}, ${searchLocation.state}, ${searchLocation.country}`);
        }

        // no match found in database, exit function
        else{
            alert("City not found")
            return
        }

        // check if search is already in localStorage and add if not
        if (getLocalStoragePosition(searchLocation) < 0) {            
            savedSearches.push(searchLocation);
            localStorage.setItem("savedWeatherSearches", JSON.stringify(savedSearches));

            // display new list of viewed city searches
            setViewed();
        }
    }

    // use regex to search for certain keywords in weather description and change background image if found
    function getBackground(weather) {

        // common description values
        var cloudyRegEx = /cloud/i;
        var sunnyRegEx = /clear|sun/i;
        var rainyRegEx = /rain|drizzle/i;
        var snowyRegEx = /snow/i;

        if (cloudyRegEx.test(weather)) {
            return "./assets/images/cloudy.jpg";
        }
        if (sunnyRegEx.test(weather)) {
            return "./assets/images/sunny.jpg";
        }
        if (rainyRegEx.test(weather)) {
            return "./assets/images/rainy.jpg";
        }
        if (snowyRegEx.test(weather)) {
            return "./assets/images/snowy.jpg";
        }

        // if none found display nice background
        return "./assets/images/cloudy.jpg";
    }

    // convert comma separated list into object.
    // test if 2nd element in array is a state or a country
    // function will fail when state full name is given that matches country name eg Georgia
    function processLocation(str) {

        // clear global variable of previous values
        searchLocation = {};        

        // if commas are in string, separate to array
        if (str.indexOf(",") > -1) {

            // find how many commas
            var count = str.match(/,/g).length;
            
            // if 1 comma found result will be a city & state or city & country
            if (count == 1) {
                var tempArr = str.split(",");
                searchLocation.city = tempArr[0].trim();
                searchLocation.state = tempArr[1].trim();

                // determine if full state name occurs in 2nd element, convert to state code if so
                if (stateFull.includes(searchLocation.state.toLowerCase())) {                    
                    searchLocation.state = stateAbv[stateFull.indexOf(searchLocation.state.toLowerCase())]
                }

                // if 2nd element is not in state list, set country value and unset state value
                if (!isState(searchLocation.state)) {
                    searchLocation.country = searchLocation.state
                    searchLocation.state = undefined;
                }
            }
            // 2 commas assumes city, state, and country
            else if (count === 2) {
                var tempArr = str.split(",");
                searchLocation.city = tempArr[0].trim();
                searchLocation.state = tempArr[1].trim();
                searchLocation.country = tempArr[2].trim();
            }
        } 
        // no commas assumes just city value
        else {
            searchLocation.city = str
        }

    }

    // returns true if str is found in either state abbreviation array or full state name array
    function isState(str) {        
        return stateAbv.includes(str.toUpperCase()) || stateFull.includes(str.toLowerCase())
    }

    // search function returns array position of location object or -1 if not found
    // state and country values are optional
    // TODO refactor as all objects now include city, state, and country
    function getLocalStoragePosition(obj){
        for(var i=0; i<savedSearches.length; i++){
            if(obj.country){
                if(obj.state){
                    if(savedSearches[i].state == obj.state && savedSearches[i].city == obj.city && savedSearches[i].country == obj.country){
                        return i
                    }
                }
                else{
                    if(savedSearches[i].city == obj.city && savedSearches[i].country == obj.country){
                        return i
                    }
                }
            }
            if(obj.state){
                if(savedSearches[i].state == obj.state && savedSearches[i].city == obj.city){
                    return i
                }
            }
            else{
                if(savedSearches[i].city == obj.city){
                    return i
                }
            }
        }
        return -1;
    }

    // list of state abbreviations
    var stateAbv = [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VI",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY"
    ]

    // list of state full names
    var stateFull = [

        "alabama",
        "alaska",
        "arizona",
        "arkansas",
        "california",
        "colorado",
        "connecticut",
        "delaware",
        "florida",
        "georgia",
        "hawaii",
        "idaho",
        "illinois",
        "indiana",
        "iowa",
        "kansas",
        "kentucky",
        "louisiana",
        "maine",
        "maryland",
        "massachusetts",
        "michigan",
        "minnesota",
        "mississippi",
        "missouri",
        "montana",
        "nebraska",
        "nevada",
        "new hampshire",
        "new jersey",
        "new mexico",
        "new york",
        "north carolina",
        "north dakota",
        "ohio",
        "oklahoma",
        "oregon",
        "pennsylvania",
        "rhode island",
        "south carolina",
        "south dakota",
        "tennessee",
        "texas",
        "utah",
        "vermont",
        "virginia",
        "washington",
        "west virginia",
        "wisconsin",
        "wyoming"
    ]
});


