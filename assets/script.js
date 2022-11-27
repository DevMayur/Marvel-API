/*keys*/
var baseUrl = "http://gateway.marvel.com/";
var publicAPI = "3517d93a9e09c8b849525ffce1f66dea";
var privateAPI = "29660c66a665288bd61fbd97be3516d39fbd348b";

/* API type */
const ApiType = {
    charactersList: 0,
};

/*endpoints*/

var charactersEndpoints = "/v1/public/characters";
var characterDetailsEndpoints =
    "/v1/public/characters"; /* add /${characterId} */

var characters;
var indexClickTracker = -1;

/* Coursonel */

var images = [
    "ant_man.jpg",
    "avengers_2.jpg",
    "avengers.jpg",
    "deadpool.jpg",
    "groot_2.jpg",
    "groot.jpg",
    "iron_man.jpg",
    "spiderman_2.jpg",
    "spiderman.jpg",
    "thor_2.jpg",
    "thor.jpg",
];

/*Init html components*/
var background_div = document.getElementById("background");
var requestButton = document.getElementById("request_data");
var rightContainer = document.getElementById("rightContainer");

/*set event listeners*/

var image = images[parseInt(getRandomInt(0, images.length - 1))];
console.log(image);

background_div.style.backgroundImage =
    "url('assets/images/landing/" + image + "')";

requestButton.addEventListener("click", function () {
    apiCall({
        endpoint: charactersEndpoints,
        type: ApiType.charactersList,
    });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

/*format endpoint*/
function apiCall(endpointData) {
    console.log("request data *********************");
    let ts = Date.now();
    let formattedUrl =
        /* base url */ baseUrl +
        /* endpoint */ endpointData.endpoint +
        /* timestamp */ "?ts=" +
        ts +
        /* api key */ "&apikey=" +
        publicAPI +
        /* hashed ( timestamp + privateAPI + publicAPI ) */
        "&hash=" +
        generateMD5(ts + privateAPI + publicAPI);

    console.log(formattedUrl);

    fetch(formattedUrl)
        .then(response => response.json())
        .then(data => {
            handleResponse({
                content: data,
                type: endpointData.type,
            });
        });
}

function handleResponse(response) {
    switch (response.type) {
        case ApiType.charactersList:
            populateCharactersToHtml(response.content);
            break;
        case ApiType.characterDetails:
            console.log(response.content);
            break;
    }
}

function generateMD5(input) {
    var hash = CryptoJS.MD5(input);
    return hash;
}

function populateCharactersToHtml(data) {
    characters = data;
    for (let i = 0; i < data.data.results.length; i++) {
        var character = data.data.results[i];
        var htmlContent = getCharacterHtmlCard(character);
        rightContainer.innerHTML += htmlContent;
    }
}

function getCharacterHtmlCard(data) {
    let elementId = data.id;
    var element = `<button class="card-item" id="${elementId}"><div>
        <img class="character-card-img" src="${data.thumbnail.path}.${data.thumbnail.extension}" alt="Avatar" style="width:100%">
        <div class="card-container">
            <h4 class="card-header">${data.name}</h4>
            <img onClick="onCharClick(${data.id})" class="fav-button" src="https://img.icons8.com/sf-black/32/null/hearts.png"/>
        </div>
    </div></button>`;
    return element;
}

function onCharClick(elementId) {
    Array.prototype.find.call(characters.data.results, x => {
        if (elementId === x.id) {
            submitJSON("showItemContent.html", x, "content");
        }
    });
}

/*
    submit JSON as 'post' to a new page
    Parameters:
    path        (URL)   path to the new page
    data        (obj)   object to be converted to JSON and passed
    postName    (str)   name of the POST parameter to send the JSON
*/
function submitJSON(path, data, postName) {
    // convert data to JSON
    var dataJSON = JSON.stringify(data);

    // create the form
    var form = document.createElement("form");
    form.setAttribute("method", "get");
    form.setAttribute("action", path);

    // create hidden input containing JSON and add to form
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", postName);
    hiddenField.setAttribute("value", dataJSON);
    form.appendChild(hiddenField);

    // add form to body and submit
    document.body.appendChild(form);
    form.submit();
}

///v1/public/characters/1017100
