// API GEO INFO BY CITY LINK : https://geocoding-api.open-meteo.com/v1/search?name=
// API METEO BY COORDS : https://api.open-meteo.com/v1/forecast?latitude=?&longitude=?&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m
import {apiKey} from "./apikey.js";

// Récupération de la géolocalisation de l'user
function getUserGeolocInfoAsync() {
    return new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLatitude = position.coords.latitude;
                const userLongitude = position.coords.longitude;
                resolve({userLatitude, userLongitude});
            },
            reject
        );
    })
}



// Récupération des infos necessaires (Longitude, Latitude) par Ville
async function getGeoInfoByCity(cityName) {
    let cityGeoInfo = [];
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
        cityGeoInfo = await response.json();
        return cityGeoInfo;
    } catch (error) {
        console.error("Erreur de récupération des infos par Ville", error);
        return null;
    }
}

// Récupération du nom de la Ville avec les coordonnés
async function getCityNameByCoord(longitude, latitude) {
    let cityInfo = [];
    try{
        const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&`);
        cityInfo = await response.json();
        return cityInfo;
    } catch (error) {
        console.error("Erreur de récupération du nom des villes par coordonnés", error);
        return null;
    }
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
    // Récupération de la div parente
    const weatherInfoParentDiv = document.querySelector(".weather-info");
    // Nettoyage de la div
    weatherInfoParentDiv.innerHTML = "";
    // Création des divs
    const cityName = document.createElement("h1");
    const weatherIcon = document.createElement("img");
    const locationTemp = document.createElement("h1");

    // Remplissage des elements avec les infos correspondantes
    cityName.innerText = cityNameData;

    // IMPLEMENTER L'ICONE SELON LA MÉTÉO (IF) A FAIRE ULTERIEUREMENT

    locationTemp.innerText = meteoInfo.current['temperature_2m'];

    // Insertion des elements dans la div parente
    weatherInfoParentDiv.appendChild(cityName);

    weatherInfoParentDiv.appendChild(locationTemp);

    // DEBUG
    console.log("test", meteoInfo.current['temperature_2m']);

}
function DisplayWeatherInfoBySearch() {
    // Si l'utilisateur utiliser une recherche par ville ou coordonnées pour obtenir les données Météo.
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
        const cityLatitude = cityInfo.results[0].latitude;
        const cityLongitude = cityInfo.results[0].longitude;
        // Récupération des informations météo avec les coordonnés
        const meteoInfo = await getWeatherInfoByCoords(cityLatitude, cityLongitude);
        // Création de la card avec les infos Météo
        createWeatherInfoCard(meteoInfo, cityName);

        // DEBUG
        console.table(cityInfo);
        console.log("Latitude de la Ville : " + cityLatitude);
        console.log("Longitude de la Ville : " + cityLongitude);
    });
}

async function DisplayWeatherInfoByGeoLoc() {
    // Récupération du bouton de géolocalisation
    const geolocBtn = document.querySelector(".geoloc-btn");
    // Ecoute de l'evenement Click sur le bouton de géolocalisation
    geolocBtn.addEventListener("click", async (event) => {
        // Récupération des infos de géolocalisation de l'utilisateur
        const userPositionInfo = await getUserGeolocInfoAsync().catch(error => {
            const errorDiv = document.getElementById("geoloc-error");
            errorDiv.innerText = "Impossible d'accéder à votre géolocalisation.";
            errorDiv.style.color = "red";
        });
        // Stockage des coords dans des variables pour plus de lisibilité
        const userPositionLatitude = userPositionInfo['userLatitude'];
        const userPositionLongitude = userPositionInfo['userLongitude'];
        // Récupération du nom de la ville par les coordonnés
        const cityInfos = await getCityNameByCoord(userPositionLongitude, userPositionLatitude);
        const cityName = cityInfos.address.city;
        // Récupération des infos météos avec les coordonnées
        const meteoInfo = await getWeatherInfoByCoords(userPositionLatitude, userPositionLongitude);
        // Création de la card
        createWeatherInfoCard(meteoInfo, cityName);




        // DEBUG
        console.table(userPositionInfo);
        console.log(userPositionInfo['userLatitude']);
        console.log(userPositionInfo['userLongitude']);
        console.table(cityInfos);
        console.log(cityInfos.address.city);
        console.log(meteoInfo);
    })
}
// EXEC

async function main() {

    DisplayWeatherInfoBySearch();
    DisplayWeatherInfoByGeoLoc();
}
main();


