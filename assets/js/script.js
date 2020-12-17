$(document).ready(function(){

    console.log("jQuery linked");

    var apiKey = "6bf8ca1fc5cbbdb760c67500eea6fdd6";

    var savedSearches = JSON.parse(localStorage.getItem("savedWeatherSearches")) || [];

    setViewed();

    $("#searchBtn").click(function(){

        search($("#locationText").val());
        
    });

    $(".saved-search").click(function(){
        search($(this).text())
    })

    function getCurrentWeather(location){
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);

            displayWeather("currentWeatherDiv", [response]);
        });
    }

    function getForecast(location){
        var queryURL = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&cnt=5&appid=${apiKey}`

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            // $("#forecast").text(JSON.stringify(response))

            displayWeather("forecastDiv", response.list)
        });
    }

    function displayWeather(target, weatherArray){

        for(var i=0; i<weatherArray.length; i++){

            // create new object containing only items we want to display
            
            var table = $("<table>");

            var newObj = {
                date: formatDate(weatherArray[i].dt),
                main: weatherArray[i].weather[0].description,                
            }

            if(target === "forecastDiv"){
                newObj.temp = weatherArray[i].temp.day;                
                newObj.min =  weatherArray[i].temp.min;
                newObj.max =  weatherArray[i].temp.max;                
            }else{            
                newObj.min = weatherArray[i].main.temp_min;
                newObj.max = weatherArray[i].main.temp_max;
                newObj.feels_like = weatherArray[i].main.feels_like;
            }

            for(var property in newObj){
                var tr = $("<tr>");
                var th = $("<th>");
                th.text(property);
                var td = $("<td>");
                td.text(newObj[property])
                tr.append(th, td);
                table.append(tr);
            }

            $("#" + target).append(table)

        }
    }

    function setViewed(){
        $("#pastSearchesDiv").html("");
        savedSearches.forEach(element => {
            var newDiv = $("<div>");
            newDiv.text(element);
            newDiv.attr("class", "saved-search");
            $("#pastSearchesDiv").append(newDiv);
        });
    }

    function formatDate(num){
        var myDate = new Date(num*1000);
        return myDate;
    }

    function search(location){
        $("#currentWeatherDiv").html("")
        
        console.log("search clicked", location);

        $("#currentWeatherDiv").text(location);

        $("#forecastDiv").text(location);

        $(".location").text(location);

        getCurrentWeather(location);
        getForecast(location);

        if(savedSearches.indexOf(location) < 0){
            savedSearches.push(location);
            localStorage.setItem("savedWeatherSearches", JSON.stringify(savedSearches));
    
            setViewed();
        }
    }
});


