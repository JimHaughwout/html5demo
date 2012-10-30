var lat = 0;
var lng = 0;

/**
 * Converts celsius to fahrenheit
 * Formula: °C  x  9/5 + 32 = °F
 */
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

/**
 * Wind percentage is in pie of 22.5º
 */
function convertWindPercentageToAcronym(percentage) {

    wind_percentages = {
        "N": [0,11.25], "NNE": [11.25,33.75], "NE": [33.75,56.25], "ENE": [56.25,78.75],
        "E": [78.75,101.25], "ESE": [101.25,123.75], "SE": [123.75,146.25], "SSE": [146.25,168.75],
        "S": [168.75,191.25], "SSW": [191.25,213.75], "SW": [213.75,236.25], "WSW": [236.25,258.75],
        "W": [258.75,281.25], "WNW": [281.25,303.75], "NW": [303.75,326.25], "NNW": [326.25,348.75]
        // "N": [348.75,360],
    }

    for(var key in wind_percentages) {
        cardinal_low = wind_percentages[key][0];
        cardinal_high = wind_percentages[key][1];
        
        if(percentage >= cardinal_low && percentage <= cardinal_high) {
            return key;
        }
    }
}

function convertIcon(icon) {
    switch(icon) {
        case '10d':
            return 'glyphs/35.png';
        case '02d':
            return 'glyphs/28.png';     
    }

    return 'glyphs/32.png';
}

function getWeatherData(lat, lng) {
    // domain = 'http://localhost:8090'
    domain = 'http://openweathermap.org';
    lat = 42.696492;
    lng = 23.326011;
    // alert(domain + '/data/2.1/find/city?lat=' + lat + '&lon=' + lng + '&cnt=1')
    // alert('http://openweathermap.org/data/2.1/find/city?lat=' + lat + '&lon=' + lng + '&cnt=1')
    $.getJSON(domain + '/data/2.1/find/city?lat=' + lat + '&lon=' + lng + '&cnt=1', function(data) {
        weather_data = {
            'name': data['list'][0]['name'],
            'temp': Math.round(data['list'][0]['main']['temp'] - 273.15),
            'temp_min': Math.round(data['list'][0]['main']['temp_min'] - 273.15),
            'temp_max': Math.round(data['list'][0]['main']['temp_max'] - 273.15),
            'pressure': data['list'][0]['main']['pressure'],
            'humidity': data['list'][0]['main']['humidity'],
            'clouds': data['list'][0]['main']['clouds'],
            'condition_description': data['list'][0]['weather'][0]['description'],
            'wind_mph': data['list'][0]['wind']['speed'] * 2.2369,
            'wind_kph': data['list'][0]['wind']['speed'] * 3.6,
            'wind_dir': convertWindPercentageToAcronym(data['list'][0]['wind']['deg']),
            'icon_url': convertIcon(data['list'][0]['weather'][0]['icon'])
        }

        weather_html = '<h1>Weather for ' + weather_data.name + '</h1>' + 
            '<p>Temperature: ' + weather_data.temp + ' &deg;C</p>' + 
            '<p>Wind: ' + weather_data.wind_kph + 'kph ' + weather_data.wind_dir + '</p>';

        $("#weather").html(weather_html);

        var weather_bg = document.getElementById('weather_bg');
        if(weather_bg.getContext) {
                var context = weather_bg.getContext('2d');

                var weather_state = new Image();
                weather_state.onload = function() {
                  weather_bg.setAttribute('width', weather_state.width);
                  weather_bg.setAttribute('height', weather_state.height);
                  context.drawImage(weather_state, 0, 0);
                  };
            weather_state.src = weather_data.icon_url;
        }


    }); 

}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    lat  = position.coords.latitude;
    lng = position.coords.longitude;
  });
}

$(document).ready(function() {
    getWeatherData(lat, lng)
});

