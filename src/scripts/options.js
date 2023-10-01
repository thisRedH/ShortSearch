
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

    if (count < maxCount) {
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

        document.getElementById(`${IDT_ENGINE_REMOVE}${count}`).addEventListener("click", (e) => {
            e.preventDefault();
            removeSearchEngine(`${IDT_ENGINE}${count}`);
        });

        document.getElementById(`${IDT_ENGINE_MOVE_UP}${count}`).addEventListener("click", (e) => {
            e.preventDefault();
            moveUpSearchEngine(`${IDT_ENGINE}${count}`);
        });

        document.getElementById(`${IDT_ENGINE_MOVE_DOWN}${count}`).addEventListener("click", (e) => {
            e.preventDefault();
            moveDownSearchEngine(`${IDT_ENGINE}${count}`);
        });

    } else {
        alert(`You can only add a maximum of ${maxCount} search engines!`);
    }
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

// --- addEventListener's ---

addEventListener("DOMContentLoaded", loadSettings);

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