# Weather App
 This app allows you to search weather by city accross the planet. It shows current weather, 5 day forecast, and keeps a history for you to easily check your favorite places.
-------------------------------------------------------------------------------------------------------------------------------------------------
 ## Features
- User presented with current location, based on IP, on page load.
- User can search any city on earth(some small cities not included).
- User can specify which city by adding state and/or country code.
- User is presented with a list of possible results if search by city alone yields more than one response.
- Searches are saved in a clickable list.
- User can see current weather details.
- User can see 5 day forecast details.
- Background changes based on weather description.
- UV warnings color-coded by severity.  
-------------------------------------------------------------------------------------------------------------------------------------------------
## How To

- Enter city name in search box. Add commas to separate city, state, and country code.
- US states can use either full name or postal code
- Non-US states/provinces must use postal code.
- Countries must use ISO 3166 country codes see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes for list.
- Queries with no matches present alert - try using country/state codes.
-------------------------------------------------------------------------------------------------------------------------------------------------
## Known Issues
- Queries for small cities return no result
-------------------------------------------------------------------------------------------------------------------------------------------------
## Resources Used
- Weather API: https://openweathermap.org/
- IP location API: https://geolocation-db.com
- City database: https://github.com/dr5hn/countries-states-cities-database
-------------------------------------------------------------------------------------------------------------------------------------------------
## Screen Shots
![Screenshot of current weather conditions](./assets/images/screenshot1.png?raw=true "Current Weather")

![Screenshot of weather forecast](./assets/images/screenshot2.png?raw=true "Weather Forecast")

![Screenshot of multiple city match](./assets/images/screenshot3.png?raw=true "Multiple City Matches")
-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------
## Assignment Requirements

# 06 Server-Side APIs: Weather Dashboard

Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/06-server-side-apis-homework-demo.png)

## Review

You are required to submit the following for review:

* The URL of the deployed application.

* The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.

- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.

