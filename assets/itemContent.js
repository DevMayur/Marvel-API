var comicItem = document.getElementById("comics-div");

/* API type */
const ContentType = {
    comics: 0,
};

function populateListItem(data) {
    let contentType = data.contentType;
    let content = data.content;

    let name = content.name;
    let url = content.resourceURI;

    var element = `<button class="card-item"><div>
        <div class="card-container">
            <h4 class="card-header">${name}</h4>
            <button onClick="onButtonClick(${url})" class="fav-button"> Open </button>
        </div>
    </div></button>`;
    return element;
}

function onButtonClick(url) {
    console.log(url);
}
