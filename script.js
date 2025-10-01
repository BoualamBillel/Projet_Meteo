// API GEO INFO BY CITY LINK : https://geocoding-api.open-meteo.com/v1/search?name=
// API METEO BY COORDS : https://api.open-meteo.com/v1/forecast?latitude=?&longitude=?&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m
async function getGeoInfoByCity(city_name) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city_name}`);
    const cityGeoInfo = await response.json();
    return cityGeoInfo;
}

async function getWeatherByCoords(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m`);
    const weatherInfo = await response.json();
    return weatherInfo;
}


