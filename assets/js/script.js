//DOM Element selectors
var searchCity = $('#searchInput')
var searchLog = $('#searchLog')
var searchResult = $('#city')
var description = $('#description')
var icon = $('#icon')
var temp = $('#temp')
var wind = $('#wind')
var humidity = $('#humidity')

document.addEventListener("DOMContentLoaded", function(event){

// Function will fetch current and future weather and store the results in local storage.
function runWeather() { 
var weatherApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${localStorage.getItem("Search-Lat")}&lon=${localStorage.getItem("Search-Lon")}&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
var currentApi = `https://api.openweathermap.org/data/2.5/weather?lat=${localStorage.getItem("Search-Lat")}&lon=${localStorage.getItem("Search-Lon")}&appid=6f64034fc295dc68d6c827ea1f2dc4d8`

//Current day data
fetch(currentApi)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            localStorage.setItem("cityName", data.name)
            localStorage.setItem("currentDate", (dayjs.unix(data.dt).format('YYYY-MM-DD')))
            localStorage.setItem("currentTemp", ((data.main.feels_like - 273.15) * 9/5 + 32).toFixed(2))
            localStorage.setItem("currentHumidity", data.main.humidity)
            localStorage.setItem("currentDescr", data.weather[0].description)
            localStorage.setItem("currentWind", data.wind.speed)
            localStorage.setItem("currentIcon", data.weather[0].icon)
        })

//5 day projection data
fetch(weatherApi)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            console.log(({D1: data.list[0], D2: data.list[6], D3: data.list[14], D4: data.list[22], D5: data.list[30]}))
            localStorage.setItem("futureDate", (dayjs(data.list[0].dt_txt).format('YYYY-MM-DD')))
            localStorage.setItem("futureTemp", ((data.list[0].main.feels_like - 273.15) * 9/5 + 32).toFixed(2))
            localStorage.setItem("futureHumidity", data.list[0].main.humidity)
            localStorage.setItem("futureDescr", data.list[0].weather[0].description)
            localStorage.setItem("futureWind", data.list[0].wind.speed)
            localStorage.setItem("futureIcon", data.list[0].weather[0].icon)
        })
    
}

//Detects entry when enter key is used in the search input field
searchCity.on("keyup", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault()
        
        var searchHistoryAp = searchCity.val();
        localStorage.setItem("Search-Entry", searchHistoryAp)

        //Appends entry to search history log
        var historyEL = $(`<button class="col-12 searchHistory"> ${localStorage.getItem("Search-Entry")} </button>`)
        searchLog.append(historyEL)

        //Searches openweather api for search entry city lat and lon
        function runCity() { 
            var weatherLoc = `https://api.openweathermap.org/geo/1.0/direct?q=${localStorage.getItem("Search-Entry")}&limit=5&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
             
            fetch(weatherLoc)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    localStorage.setItem("Search-Lat", (data[0].lat).toFixed(2))
                    localStorage.setItem("Search-Lon", (data[0].lon).toFixed(2))
                })
            }

        runCity()
        runWeather()
        
        //Current day data transfer to DOM
        searchResult.text(`${localStorage.getItem("cityName")} ${localStorage.getItem("currentDate")}`)
        description.text(`${localStorage.getItem("currentDescr")} `)
        icon.attr("src", `https://openweathermap.org/img/w/${localStorage.getItem("currentIcon")}.png`)
        temp.text(`Temperature: ${localStorage.getItem("currentTemp")}°F`)    
        humidity.text(`Humidity: ${localStorage.getItem("currentHumidity")}%`)  
        wind.text(`Wind Speed: ${localStorage.getItem("currentWind")} mph`)  
    }
    event.stopPropagation()
})

//Detects when a logged entry button is clicked
var searchHistoryEl = $('.searchHistory')
$('#searchLog').on("click", searchHistoryEl, function(event){
    console.log("hello");
    var searchHistory = event.target.textContent;
    console.log(searchHistory);
        localStorage.setItem("recallEntry", searchHistory)

        //Searches openweather api for recalled entry city lat and lon
        function recallCity() { 
            var weatherLoc = `https://api.openweathermap.org/geo/1.0/direct?q=${localStorage.getItem("recallEntry")}&limit=5&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
             
            fetch(weatherLoc)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    localStorage.setItem("Search-Lat", (data[0].lat).toFixed(2))
                    localStorage.setItem("Search-Lon", (data[0].lon).toFixed(2))
                })
            }

        recallCity()
        runWeather()
        
        ////Current day data transfer to DOM
        searchResult.text(`${localStorage.getItem("cityName")} ${localStorage.getItem("currentDate")}`)
        description.text(`${localStorage.getItem("currentDescr")} `)
        icon.attr("src", `https://openweathermap.org/img/w/${localStorage.getItem("currentIcon")}.png`)
        temp.text(`Temperature: ${localStorage.getItem("currentTemp")}°F`)    
        humidity.text(`Humidity: ${localStorage.getItem("currentHumidity")}%`)  
        wind.text(`Wind Speed: ${localStorage.getItem("currentWind")} mph`)

        
  });

console.log("done");
})
