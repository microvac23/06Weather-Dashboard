//NEEDS WORK ON ASYNCRONOUS EVENT HANDLING


//DOM Element selectors
var searchCity = $('#searchInput')
var searchLog = $('#searchLog')
var searchResult = $('#city')
var description = $('#description')
var icon = $('#icon')
var temp = $('#temp')
var wind = $('#wind')
var humidity = $('#humidity')
var nextFiveDates = [$('#date1'), $('#date2'), $('#date3'), $('#date4'), $('#date5')]
var nextFiveTemps = [$('#temp1'), $('#temp2'), $('#temp3'), $('#temp4'), $('#temp5')]
var nextFiveWinds = [$('#wind1'), $('#wind2'), $('#wind3'), $('#wind4'), $('#wind5')]
var nextFiveHumidities = [$('#humidity1'), $('#humidity2'), $('#humidity3'), $('#humidity4'), $('#humidity5')]

document.addEventListener("DOMContentLoaded", function(event){

// Empties local storage on page reload
window.onbeforeunload = function (e) {
        localStorage.clear();
    };



// Function will fetch current and future weather and store the results in local storage.
async function runWeather() { 
var weatherApi = await `https://api.openweathermap.org/data/2.5/forecast?lat=${localStorage.getItem("Search-Lat")}&lon=${localStorage.getItem("Search-Lon")}&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
var currentApi = await `https://api.openweathermap.org/data/2.5/weather?lat=${localStorage.getItem("Search-Lat")}&lon=${localStorage.getItem("Search-Lon")}&appid=6f64034fc295dc68d6c827ea1f2dc4d8`

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
            console.log('future', data)
            
            setFiveDays(data)
        })
    
}

//5 day projection html setting
const setFiveDays = function (data) {
        fiveDates = [(dayjs.unix(data.list[8].dt).format('YYYY-MM-DD')), (dayjs.unix(data.list[16].dt).format('YYYY-MM-DD')), (dayjs.unix(data.list[24].dt).format('YYYY-MM-DD')), (dayjs.unix(data.list[32].dt).format('YYYY-MM-DD')), (dayjs.unix(data.list[39].dt).format('YYYY-MM-DD'))]

        fiveTemps = [((data.list[0].main.feels_like - 273.15) * 9/5 + 32).toFixed(2), ((data.list[8].main.feels_like - 273.15) * 9/5 + 32).toFixed(2), ((data.list[16].main.feels_like - 273.15) * 9/5 + 32).toFixed(2), ((data.list[24].main.feels_like - 273.15) * 9/5 + 32).toFixed(2), ((data.list[32].main.feels_like - 273.15) * 9/5 + 32).toFixed(2)]

        fiveWinds = [data.list[0].wind.speed, data.list[8].wind.speed, data.list[16].wind.speed, data.list[24].wind.speed, data.list[32].wind.speed]

        fiveHumidities = [data.list[0].main.humidity, data.list[8].main.humidity, data.list[16].main.humidity, data.list[24].main.humidity, data.list[32].main.humidity]

        //populates html text with data
        for(i=0; i < nextFiveDates.length; i++) {
            nextFiveDates[i].text(fiveDates[i])
            nextFiveTemps[i].text(`Temp: ${fiveTemps[i]}°F`)
            nextFiveWinds[i].text(`Wind: ${fiveWinds[i]} mph`)
            nextFiveHumidities[i].text(`Humidity: ${fiveHumidities[i]}%`)
        }
}

//Detects entry when enter key is used in the search input field
searchCity.on("keyup", async function(event) {
    if(event.keyCode === 13) {
        event.preventDefault()
        
        var searchHistoryAp = await searchCity.val();
        localStorage.setItem("Search-Entry", searchHistoryAp)

        //Appends entry to search history log
        var historyEL = $(`<button class="col-12 searchHistory"> ${localStorage.getItem("Search-Entry")} </button>`)
        searchLog.append(historyEL)

        //Searches openweather api for search entry city lat and lon
        async function runCity() { 
            var weatherLoc = await `https://api.openweathermap.org/geo/1.0/direct?q=${localStorage.getItem("Search-Entry")}&limit=5&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
             
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
$('#searchLog').on("click", searchHistoryEl, async function(event){
    console.log("hello");
    var searchHistory = event.target.textContent;
    console.log(searchHistory);
        localStorage.setItem("recallEntry", searchHistory)

        //Searches openweather api for recalled entry city lat and lon
        async function recallCity() { 
            var weatherLoc = await `https://api.openweathermap.org/geo/1.0/direct?q=${localStorage.getItem("recallEntry")}&limit=5&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
             
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
