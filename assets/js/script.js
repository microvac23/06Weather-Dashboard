var searchCity = $('#searchInput')
var searchLog = $('#searchLog')
var searchResult = $('#city')
var description = $('#description')
var icon = $('#icon')
var temp = $('#temp')
var wind = $('#wind')
var humidity = $('#humidity')

function runCity() { 
var weatherLoc = `http://api.openweathermap.org/geo/1.0/direct?q=${localStorage.getItem("Search-Entry")}&limit=5&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
 
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

function runWeather() { 
var weatherApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${localStorage.getItem("Search-Lat")}&lon=${localStorage.getItem("Search-Lon")}&appid=6f64034fc295dc68d6c827ea1f2dc4d8`
 
fetch(weatherApi)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            localStorage.setItem("Search-Date", data.list[0].dt_txt)
            localStorage.setItem("Search-Temp", ((data.list[0].main.feels_like - 273.15) * 9/5 + 32).toFixed(2))
            localStorage.setItem("Humidity", data.list[0].main.humidity)
            localStorage.setItem("Search-Descr", data.list[0].weather[0].description)
            localStorage.setItem("Wind", data.list[0].wind.speed)
            localStorage.setItem("Search-Icon", data.list[0].weather[0].icon)
        })
    
}

searchCity.on("keyup", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault()
        
        var searchHistory = searchCity.val();
        localStorage.setItem("Search-Entry", searchHistory)

        var historyEL = $(`<button class="col-12"> ${localStorage.getItem("Search-Entry")} </button>`)
        searchLog.append(historyEL)

        runCity()
        runWeather()

        searchResult.text(`${localStorage.getItem("Search-Entry")} ${localStorage.getItem("Search-Date")}`)
        description.text(`${localStorage.getItem("Search-Descr")} `)
        icon.attr("src", `http://openweathermap.org/img/w/${localStorage.getItem("Search-Icon")}.png`)
        temp.text(`Temperature: ${localStorage.getItem("Search-Temp")}°F`)    
        humidity.text(`Humidity: ${localStorage.getItem("Humidity")}%`)  
        wind.text(`Wind Speed: ${localStorage.getItem("Wind")} mph`)  
    }
    event.stopPropagation()
})
    
    
