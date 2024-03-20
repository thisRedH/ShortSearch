
var SPECIAL_QUERY_PLACEHOLDER = "%s";

// ID Templates
const IDT_ENGINE = "engine-id-";
const IDT_ENGINE_NAME = "engine-name-";
const IDT_ENGINE_URL = "engine-url-";
const IDT_ENGINE_REMOVE = "engine-remove-";
const IDT_ENGINE_MOVE_UP = "engine-move-up-";
const IDT_ENGINE_MOVE_DOWN = "engine-move-down-";

function addSearchEngine(name = "", url = "") {
    const maxCount = 10;
    const container = document.getElementById("engines-container");
    const count = container.childElementCount;

    if (count >= maxCount) {
        alert(`You can only add a maximum of ${maxCount} search engines!`);
        return;
    }

    const newEngine = document.createElement("tr");
    newEngine.className = "engine engine-fade-in";
    newEngine.id = IDT_ENGINE + count;
    newEngine.innerHTML = `
        <td class="engine-number"><span>${count}</span>.</td>
        <td class="engine-name"><input name="engine-name-${count}" id="${IDT_ENGINE_NAME}${count}" list="engines-name-list" value="${name}"></td>
        <td class="engine-url"><input name="engine-url-${count}" id="${IDT_ENGINE_URL}${count}" list="engines-url-list" value="${url}"></td>
        <td class="engine-remove"><a href="javascript:void(0)" name="engine-remove-${count}" id="${IDT_ENGINE_REMOVE}${count}"><img src="./assets/x.svg" alt="X Remove Button"></a></td>
        <td class="engine-move-up"><a href="javascript:void(0)" name="engine-move-up-${count}" id="${IDT_ENGINE_MOVE_UP}${count}"><img src="./assets/arrow_up.svg" alt="Move Up Button"></a></td>
        <td class="engine-move-down"><a href="javascript:void(0)" name="engine-move-down-${count}" id="${IDT_ENGINE_MOVE_DOWN}${count}"><img src="./assets/arrow_down.svg" alt="Move Down Button"></a></td>
    `;
    
    container.appendChild(newEngine);

    newEngine.addEventListener("animationend", (e) => {
        if (e.target.classList.contains("engine-fade-in"))
            newEngine.classList.remove("engine-fade-in");
    }, {once: true})

    // Automatic url when name found in ENGINES_DATALIST_DICT
    document.getElementById(`${IDT_ENGINE_NAME}${count}`).addEventListener("input", (e) => {
        url = ENGINES_DATALIST[e.target.value];
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
    if (document.getElementById("engines-container").childElementCount <= 1) {
        showError("You Need at least 1 engine!");
        return;
    }

    const engine = document.getElementById(id);
    engine.classList.add("engine-fade-out");
    engine.addEventListener("animationend", (e) => {
        engine.remove();
        reorderSearchEngins();
    }, {once: true})
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

    var enginesList = [];
    var enginesNoSpecial = [];
    var enginesEmpty = [];

    var iterEngines = 0;

    for (let [id, value] of formData.entries()) {
        // IDT_ENGINE_NAME
        if (id.startsWith(IDT_ENGINE_NAME)) {
            const engineIDNumber = LAST_NUMBER.exec(id)[1];

            const nameData = value;
            const urlData = formData.get(IDT_ENGINE_URL + engineIDNumber);

            let engine = {
                name: nameData,
                url: urlData,
            };
            enginesList.push(engine);

            if (!urlData) {
                enginesEmpty.push(iterEngines);
            } else if (!urlData.includes(SPECIAL_QUERY_PLACEHOLDER)) {
                enginesNoSpecial.push(iterEngines);
            }

            iterEngines++;
        // IDT_ENGINE_URL
        } else if (id.startsWith(IDT_ENGINE_URL)) {
            // Handlet with IDT_ENGINE_NAME
            continue;
        }
    }

    // Save to Chrome
    try {
        await saveSettings({enginesList});
    } catch (error) {
        showError("Could not save settings", error);
    }

    // Errors
    if (enginesEmpty.length) {
        var msg = `Search Engine ${enginesEmpty} dosn't have an URL.\nIt will not work!`
        if (enginesEmpty.length > 1) {
            var msg = `Search Engine's ${beautifyArray(enginesEmpty)} don't have a URL.\nThey will not work!`
        }

        showError(msg);
    }
    if (enginesNoSpecial.length) {
        var msg = `Search Engine ${enginesNoSpecial} dosn't have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nIt will not work as expected!`
        if (enginesNoSpecial.length > 1) {
            var msg = `Search Engine's ${beautifyArray(enginesNoSpecial)} don't have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nThey will not work as expected!`
        }

        showError(msg);
    }
}

function displaySettings(settings) {
    for (const engine of settings.enginesList) {
        addSearchEngine(engine.name, engine.url);
    }
}

addEventListener("DOMContentLoaded", () => {
    loadSettings(DEFAULT_SETTINGS).then(displaySettings);
    populateDatalist(document.getElementById("engines-name-list"), Object.keys(ENGINES_DATALIST));
    populateDatalist(document.getElementById("engines-url-list"), Object.values(ENGINES_DATALIST));


    document.getElementById("engine-add-button").addEventListener("click", () => {
        addSearchEngine();
    });

    document.getElementById("settings-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveSettingsForm();
    });

    function goToShortcuts(active = true) {
        chrome.tabs.getCurrent(tab => {
            chrome.tabs.create({
                url: "chrome://extensions/shortcuts",
                active: active,
                index: tab.index +1
            });
        });
    };

    document.getElementById("open-chrome-shortcuts").addEventListener("keypress", (e) => {
        e.preventDefault();

        if (e.key === "Enter") {
            goToShortcuts(true);
        }
    });

    document.getElementById("open-chrome-shortcuts").addEventListener("mousedown", (e) => {
        e.preventDefault();

        if (e.button === 0)
            goToShortcuts(true);
        if (e.button === 1)
            goToShortcuts(false);
    });
});
