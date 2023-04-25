class Api {
    data = null;
    async getData() {
        await fetch("../data/games.json").then(response => {
            return response.json();
        }).then(newData => {
            this.data = newData.games; //newData["games"]
        });
    }
}

class Filter {
    filteredResult = [];

    filter(platform, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].platform === platform) {
                this.filteredResult.push(data[i]);
            }
        }
        if (this.filteredResult.length <= 0) {
            this.filteredResult.push(data[0]);
        }
    }

    randomFromResult() {
        let randomNumber = Math.floor(Math.random() * this.filteredResult.length);
        return this.filteredResult[randomNumber];
    }
}

class URLScraper {
    currentURL;
    platform;
    pretty;
    constructor() {
        this.currentURL = window.location.href;
    }

    getDataFromURL() {
        this.platform = this.currentURL.split("platform=")[1];
        if (this.platform === undefined) {
            this.platform = "";
        }

        this.pretty = new PrettyPlatform(this.platform);
        this.platform = this.pretty.platform;
    }
}

class PrettyPlatform {
    platform;

    constructor(platform) {
        this.platform = platform;
        this.platformToUpperCase();
        this.removeSpaces();
    }

    platformToUpperCase() {
        this.platform = this.platform.toUpperCase();
    }

    removeSpaces() {
        this.platform = this.platform.replaceAll(" ", "");
        this.platform = this.platform.replaceAll("%20", "");
    }
    
}

class Render {
    move;
    articleToBeRendered;
    headingToBeRendered;

    constructor() {
        this.articleToBeRendered = document.createElement("article");
        this.headingToBeRendered = document.createElement("h1");
        this.move = new Move(this.articleToBeRendered);
    }
    render(randomResult) {
        this.articleToBeRendered.classList = "card";
        document.getElementsByTagName("body")[0].appendChild(this.articleToBeRendered);

        this.headingToBeRendered.classList = "card__heading"
        document.getElementsByTagName("article")[0].appendChild(this.headingToBeRendered);

        this.headingToBeRendered.innerText = randomResult.title;
    }
}

class Move {
    articleToMove;
    move = false;
    constructor(articleToMove) {
        this.articleToMove = articleToMove;

        this.articleToMove.onclick = () => {
            this.move = !this.move;
        }
        window.onmousemove = (event) => {
            if (this.move === true) {
                this.articleToMove.style.position = "absolute";
                this.articleToMove.style.transform = "translate(-50%,-50%)"
                this.articleToMove.style.left = Math.floor(event.clientX / window.innerWidth * 100) + window.innerWidth / 2 + "px";
                this.articleToMove.style.top = Math.floor(event.clientY / window.innerHeight * 100) + window.innerHeight / 2 + "px";
            }

        }
    }
}
class App {
    api;
    filter;
    urlScraper;
    render;

    
    constructor() {
        this.api = new Api();
        this.filter = new Filter();
        this.urlScraper = new URLScraper();
        this.render = new Render();


        this.urlScraper.getDataFromURL();

        this.api.getData().then(
            () => {
                this.filter.filter(this.urlScraper.platform, this.api.data);
                this.render.render(this.filter.randomFromResult());
            }
        );

    }
}
const app = new App();
