
// Global "Settings"
var SPECIAL_QUERY_PLACEHOLDER = "%s";

// Regex
const LAST_NUMBER = /(\d+)(?!.*\d)/

// ID Templates
const IDT_ENGINE = "engine-id-";
const IDT_ENGINE_NAME = "engine-name-";
const IDT_ENGINE_URL = "engine-url-";
const IDT_ENGINE_REMOVE = "engine-remove-";
const IDT_ENGINE_MOVE_UP = "engine-move-up-";
const IDT_ENGINE_MOVE_DOWN = "engine-move-down-";

const ENGINES_DATALIST_DICT = {
    // General Search engines
    "Google": "http://google.com/search?q=%s",
    "Bing": "http://bing.com/search?q=%s",
    "Yahoo": "http://search.yahoo.com/search?p=%s",
    "DuckDuckGo": "http://duckduckgo.com/?q=%s",
    "Ecosia": "https://www.ecosia.org/search?q=%s",
    "Startpage": "https://www.startpage.com/do/dsearch?query=%s",
    "Baidu": "http://baidu.com/s?wd=%s",
    "Yandex": "http://yandex.com/search/?text=%s",
    "Ask.com": "http://ask.com/web?q=%s",
    "AOL Search": "http://search.aol.com/aol/search?q=%s",
    "Excite": "http://results.excite.com/serp?q=%s",
    "All the Internet": "http://alltheinternet.com/?q=%s",
    "Lycos": "http://search.lycos.com/web/?q=%s",
    "Dogpile": "http://dogpile.com/search/web?q=%s",
    "Swisscows": "http://swisscows.com/web?query=%s",
    "Mojeek": "http://mojeek.com/search?q=%s",
    "Naver": "http://search.naver.com/search.naver?query=%s",
    "Seznam": "http://search.seznam.cz/?q=%s",
    "Qwant": "http://qwant.com/?q=%s",
    
    // Encyclopedia
    "Wikipedia": "http://wikipedia.org/wiki/%s",
    "Citizendium": "http://citizendium.org/wiki/%s",
    "encyclopedia": "http://encyclopedia.com/gsearch?q=%s",
    
    // TV
    "TMDB": "http://themoviedb.org/search?query=%s",
    "IMDb": "http://imdb.com/find/?q=c",
    
    // Social Media
    "Youtube": "http://youtube.com/results?search_query=%s",
    "Reddit": "http://reddit.com/search/?q=%s",
    "Twitter": "http://twitter.com/search?q=%s",
    "X": "http://x.com/search?q=%s",
    "Facebook": "http://facebook.com/search/?q=%s",
    "TikTok": "http://tiktok.com/search?q=%s",
    "Pinterest": "http://pinterest.com/search/?q=%s",
    
    // Shops
    "Amazon": "http://amazon.com/s?k=%s",
    "Facebook Marketplace": "http://facebook.com/marketplace/search/?query=%s",

    // PC/Coding Stuff
    "Github": "http://github.com/search?q=%s",
    "Stack Overflow": "http://stackoverflow.com/search?q=%s",
    "Stack Exchange": "http://stackexchange.com/search?q=%s",
    "PCPartPicker": "http://pcpartpicker.com/search/?q=%s",
    "Geizhals": "http://geizhals.de/?fs=%s",
    
    // Game Stuff
    "Steam": "http://steampowered.com/search/?term=%s",
    "GOG": "http://gog.com/games?query=%s",
    
    // Special
    "The Pirate Bay": "http://thepiratebay10.org/search/%s",
}

function showError(msg, err = new Error(null)) {
    console.warn("ShortcutSearch: ", msg, '\n', err);
    alert(`${msg}\n${err}`);
}

function arrayToStrAnd(arr) {
    if (arr.length === 0) {
        return '';
    } else if (arr.length === 1) {
        return arr[0].toString();
    } else if (arr.length === 2) {
        return `${arr[0]} and ${arr[1]}`;
    } else {
        const lastItem = arr.pop();
        const joinedItems = arr.join(', ');
        return `${joinedItems}, and ${lastItem}`;
    }
}

function addSearchEngine(name = "", url = "") {
    const maxCount = 10;
    const container = document.getElementById("engines-container");
    const count = container.childElementCount;

    if (count > maxCount) {
        alert(`You can only add a maximum of ${maxCount} search engines!`);
        return;
    }

    const newEngine = document.createElement("tr");
    newEngine.className = "engine";
    newEngine.id = IDT_ENGINE + count;
    newEngine.innerHTML = `
        <td class="engine-number"><span>${count}</span>.</td>
        <td class="engine-name"><input name="engine-name-${count}" id="${IDT_ENGINE_NAME}${count}" list="engines-name-list" value="${name}"></td>
        <td class="engine-url"><input name="engine-url-${count}" id="${IDT_ENGINE_URL}${count}" list="engines-url-list" value="${url}"></td>
        <td class="engine-remove"><a href="#" name="engine-remove-${count}" id="${IDT_ENGINE_REMOVE}${count}"><img src="./assets/x.svg" alt="X Remove Button"></a></td>
        <td class="engine-move-up"><a href="#" name="engine-move-up-${count}" id="${IDT_ENGINE_MOVE_UP}${count}"><img src="./assets/arrow_up.svg" alt="Arrow Up Button"></a></td>
        <td class="engine-move-down"><a href="#" name="engine-move-down-${count}" id="${IDT_ENGINE_MOVE_DOWN}${count}"><img src="./assets/arrow_down.svg" alt="Arrow Down Button"></a></td>
    `;
    
    container.appendChild(newEngine);

    // Automatic url when name found in ENGINES_DATALIST_DICT
    document.getElementById(`${IDT_ENGINE_NAME}${count}`).addEventListener("input", (e) => {
        url = ENGINES_DATALIST_DICT[e.target.value];
        if (url) {
            document.getElementById(`${IDT_ENGINE_URL}${count}`)
            .value = url;
        }
    });

    // removeSearchEngine
    document.getElementById(`${IDT_ENGINE_REMOVE}${count}`).addEventListener("click", (e) => {
        e.preventDefault();
        removeSearchEngine(`${IDT_ENGINE}${count}`);
    });

    // moveUpSearchEngine
    document.getElementById(`${IDT_ENGINE_MOVE_UP}${count}`).addEventListener("click", (e) => {
        e.preventDefault();
        moveUpSearchEngine(`${IDT_ENGINE}${count}`);
    });

    // moveDownSearchEngine
    document.getElementById(`${IDT_ENGINE_MOVE_DOWN}${count}`).addEventListener("click", (e) => {
        e.preventDefault();
        moveDownSearchEngine(`${IDT_ENGINE}${count}`);
    });
}

function removeSearchEngine(id) {
    const container = document.getElementById("engines-container");
    const count = container.count;

    if (count <= 1) return;
    
    document.getElementById(id).remove();

    reorderSearchEngins();
}

function moveUpSearchEngine(id) {
    const engine = document.getElementById(id);
    
    if(engine.previousElementSibling)
        engine.parentNode.insertBefore(engine, engine.previousElementSibling);
    
    reorderSearchEngins();
}

function moveDownSearchEngine(id) {
    const engine = document.getElementById(id);

    if(engine.nextElementSibling)
        engine.parentNode.insertBefore(engine.nextElementSibling, engine);
    
    reorderSearchEngins();
}

function reorderSearchEngins() {
    const container = document.getElementById("engines-container");
    const children = container.children;

    for (let i = 0; i < children.length; i++) {
        let engine = children[i];
        let numberObj = engine.querySelector("td.engine-number > span");
        numberObj.innerHTML = i;
    }
}

async function saveSettingsForm() {
    let formData = new FormData(document.getElementById("settings-form"));

    var enginesList = new Array();
    var enginesNoSpecial = new Array();

    var iterEngines = 0;

    for (let pair of formData.entries()) {
        // IDT_ENGINE_NAME
        if (pair[0].startsWith(IDT_ENGINE_NAME)) {
            const engineIDNumber = LAST_NUMBER.exec(pair[0])[1];

            const nameData = pair[1];
            const urlData = formData.get(IDT_ENGINE_URL + engineIDNumber);

            if (!urlData.includes(SPECIAL_QUERY_PLACEHOLDER)) {
                enginesNoSpecial.push(iterEngines + 1);
            }

            let engine = {
                name: nameData,
                url: urlData,
            };
            enginesList.push(engine);

            iterEngines += 1;
        // IDT_ENGINE_URL
        } else if (pair[0].startsWith(IDT_ENGINE_URL)) {
            // Handlet with IDT_ENGINE_NAME
            continue;
        }
    }

    try {
        let settingsData = {enginesList};
        await chrome.storage.sync.set(settingsData);
    } catch (error) {
        showError("Could not save settings", error);
    }

    // Errors
    if (enginesNoSpecial.length) {
        var msg = `Search Engine ${enginesNoSpecial} dosn't have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nIt will not work as expected!`
        if (enginesNoSpecial.length > 1) {
            var msg = `Search Engine's ${arrayToStrAnd(enginesNoSpecial)} don't have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nThey will not work as expected!`
        }

        showError(msg);
    }

}

async function loadSettings() {
    settings = await chrome.storage.sync.get(null);
    for (let engine of settings.enginesList) {
        addSearchEngine(engine.name, engine.url);
    }
}

function populateDatalist(id, options) {
    const datalist = document.getElementById(id);

    for(let option of options) {
        const newOption = document.createElement("option");
        newOption.value = option;

        datalist.appendChild(newOption);
    }
}

function populateEngineDatalists(enginesDict) {
    populateDatalist("engines-name-list", Object.keys(enginesDict));
    populateDatalist("engines-url-list", Object.values(enginesDict));
}

addEventListener("DOMContentLoaded", () => {
    loadSettings();
    populateEngineDatalists(ENGINES_DATALIST_DICT);

    document.getElementById("engine-add-button").addEventListener("click", () => {
        addSearchEngine();
    });
    
    document.getElementById("settings-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveSettingsForm();
    });
    
    document.getElementById("open-chrome-shortcuts").addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
    });
});
