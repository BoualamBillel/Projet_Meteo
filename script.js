// API GEO INFO BY CITY LINK : https://geocoding-api.open-meteo.com/v1/search?name=
// API METEO BY COORDS : https://api.open-meteo.com/v1/forecast?latitude=?&longitude=?&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m




// Récupération des infos necessaires (Longitude, Latitude) par Ville
async function getGeoInfoByCity(cityName) {
    let cityGeoInfo = [];
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
        cityGeoInfo = await response.json();
    } catch (error) {
        console.error("Erreur de récupération des infos par Ville", error);
        return null;
    }
    return cityGeoInfo;
}

// Récupération des informations météo par coords (Latitude, Longitude)
async function getWeatherInfoByCoords(latitude, longitude) {
    let meteoInfo = [];
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m`);
        meteoInfo = await response.json();
    } catch (error) {
        console.error("Erreur de récuperation des informations météo", error);
        return null;
    }
    return meteoInfo;
}
// Création des elements necessaires à l'affichage des infos de Météo
async function createWeatherInfoCard(meteoInfo, cityNameData) {
    // Création des divs
    const cityName = document.createElement("h1");
    const weatherIcon = document.createElement("img");
    const locationTemp = document.createElement("h1");

    // Remplissage des elements avec les infos correspondantes
    cityName.innerText = cityNameData;

    // IMPLEMENTER L'ICONE SELON LA MÉTÉO (IF) A FAIRE ULTERIEUREMENT

    locationTemp.innerText = meteoInfo.current['temperature_2m'];

    // DEBUG
    console.log("test", meteoInfo.current['temperature_2m']);

}

// EXEC

async function main(){

    
    // Récupération du formulaire
    const searchForm = document.querySelector(".search-form");
    searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Récupération des données du formulaire
    const formData = new FormData(searchForm);
    const searchCityInput = formData.get("city");
    // Récupération des données de la Ville
    const cityInfo = await getGeoInfoByCity(searchCityInput);
    // Récupération du nom de la ville dont les données sont récupérer
    const cityName = cityInfo.results[0].name;
    
    // Récupération des coordonnés de la ville la plus proche de la recherche
    const cityLongitude = cityInfo.results[0].longitude;
    const cityLatitude = cityInfo.results[0].latitude;
    // Récupération des informations météo avec les coordonnés
    const meteoInfo = await getWeatherInfoByCoords(cityLatitude, cityLongitude);
    // Création de la card avec les infos Météo
    createWeatherInfoCard(meteoInfo, cityName)
    

    // DEBUG
    console.table(cityInfo);
    console.log(cityLatitude);
    console.log(cityLongitude);

    
})
}
main();