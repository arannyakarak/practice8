let numberOfCards = 0;
const apiKey = 'eb380ce293c80acb396c9d71258f3d32';
const form = document.querySelector('form');
const weatherDisplay = document.querySelector('#weather-results');
var formInput = document.querySelector('#city-input');
var inputVal;
var result;
var res;

//Function to delete the various cards using the id
function deleteCard(n){
    document.getElementById(n).remove();
    numberOfCards--;
}

//On form submission collect the input of the user and prevent the page from reloading
form.addEventListener('submit', e => {
    e.preventDefault();
    inputVal = formInput.value.toString();
    if(numberOfCards > 0){
        let alreadySearched = document.getElementsByClassName('city');
        for(let i = 0; i < alreadySearched.length; i++){
            let element = alreadySearched[i].innerText.toString();
            console.log(element);
            if(element.indexOf(inputVal) !== -1){
                let alreadySearchedCards = document.getElementsByClassName('weather-card');
                alreadySearchedCards[i].remove();
            }
        }
    }
    useWeather();
});
async function fetchWeather(key,city){
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
        let data = await response.json();
        localStorage.setItem('wtr', JSON.stringify(data));
        return data;
    }
    catch(err) {
        return JSON.parse(localStorage.getItem('wtr'));
    }
}

async function useWeather(){
    try{
        result = await fetchWeather(apiKey, inputVal);
        res = await fetchLattLong(inputVal);
    
        addCard();
    }
    catch(error){
        alert('Please enter a valid city');
        form.reset();
        formInput.focus();
    }
}

async function fetchLattLong(city){
    // let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('origin','http://127.0.0.1:5503');
    try {
        // let response = await fetch(`https://api.waqi.info/feed/austin/?token=c3d00f04680ed6402e8567a9314b1df8073cae74`, {
        //     // mode: 'no-cors',
        //     // credentials: 'include',
        //     method: 'GET',
        //     headers: headers
        // });
        let response = await fetch(`https://api.waqi.info/feed/${city}/?token=c3d00f04680ed6402e8567a9314b1df8073cae74`);
        let data = await response.json();
        // let data =  localStorage.getItem("latlon");
        localStorage.setItem('latlon', JSON.stringify(data));
        console.log(data);
        return data;
    } catch (err) {
        //this only runs if an error occurs in above process
        console.log('Oops!', err);
        // console.log(localStorage.getItem('latlon'));
        return JSON.parse(localStorage.getItem('latlon'));
    }
}

function addCard(){
    numberOfCards ++;
    var {name, main, sys, wind, weather} = result;
    var {data, status} = res;

    let newCard = `<div class="weather-card" id="card-${numberOfCards}">
    <button class="card-pin" onClick="deleteCard('card-${numberOfCards}')"></button>
    <div class="city">${name}<sup>${sys.country}</sup></div>
    <div class="temperature">${Math.round(main.temp)}<sup>o</sup>C</div>
    <div class="weather">
        <div class="weather-icon"><img src="asset/cloudy.png" alt="${weather[0].main} icon"></div>
        <div class="weather-description">${weather[0].description}</div>
    </div>
    <div class="wind-speed">Wind speed: ${wind.speed}m/s</div>
    <div class="humidity">Humidy: ${main.humidity}%</div>
    <div class="airq"> 
    
    <div class="air">AQI: ${data.aqi}%</div>
    
    </div> 
    <div class="sta">Status: ${status}</div>
</div>`;

    weatherDisplay.insertAdjacentHTML("afterbegin",newCard);
    document.getElementById(`card-${numberOfCards}`).style.animation = 'card-spin 1s ease-out';
    form.reset();
    formInput.focus();
}

