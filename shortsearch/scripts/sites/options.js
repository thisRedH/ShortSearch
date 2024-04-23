
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
    newEngine.className = "engine fade-in-short";
    newEngine.id = IDT_ENGINE + count;
    newEngine.innerHTML = `
        <td class="engine-number"><span>${count +1}</span>.</td>
        <td class="engine-name"><input name="${IDT_ENGINE_NAME}${count}" id="${IDT_ENGINE_NAME}${count}" list="engines-name-list" value="${name}"></td>
        <td class="engine-url"><input name="${IDT_ENGINE_URL}${count}" id="${IDT_ENGINE_URL}${count}" list="engines-url-list" value="${url}"></td>
        <td class="engine-remove"><a href="javascript:void(0)" name="${IDT_ENGINE_REMOVE}${count}" id="${IDT_ENGINE_REMOVE}${count}"><img class="svg-img-btn" src="./assets/x.svg" alt="X Remove Button"></a></td>
        <td class="engine-move-up"><a href="javascript:void(0)" name="${IDT_ENGINE_MOVE_UP}${count}" id="${IDT_ENGINE_MOVE_UP}${count}"><img class="svg-img-btn" src="./assets/arrow_up.svg" alt="Move Up Button"></a></td>
        <td class="engine-move-down"><a href="javascript:void(0)" name="${IDT_ENGINE_MOVE_DOWN}${count}" id="${IDT_ENGINE_MOVE_DOWN}${count}"><img class="svg-img-btn" src="./assets/arrow_down.svg" alt="Move Down Button"></a></td>
    `;

    container.appendChild(newEngine);

    newEngine.addEventListener("animationend", (e) => {
        if (e.target.classList.contains("fade-in-short"))
            newEngine.classList.remove("fade-in-short");
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
    engine.classList.add("fade-out-short");
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
        numberObj.innerHTML = i +1;
    }
}

async function saveSettingsForm() {
    let formData = new FormData(document.getElementById("settings-form"));

    let optEnginesList = [];
    let enginesNoSpecial = [];
    let enginesEmpty = [];
    let iterEngines = 0;

    let optWindowTarget = "";
    let optEnginePlaceholder = "";
    let optEvalMode = "";

    for (let [id, value] of formData.entries()) {
        // IDT_ENGINE_NAME && IDT_ENGINE_URL
        if (id.startsWith(IDT_ENGINE_NAME)) {
            const engineIDNumber = LAST_NUMBER.exec(id)[1];

            const nameData = value;
            const urlData = formData.get(IDT_ENGINE_URL + engineIDNumber);

            let engine = {
                name: nameData,
                url: urlData,
            };
            optEnginesList.push(engine);

            if (!urlData) {
                enginesEmpty.push(iterEngines);
            } else if (!urlData.includes(SPECIAL_QUERY_PLACEHOLDER)) {
                enginesNoSpecial.push(iterEngines);
            }

            iterEngines++;
        } else if (id === "window-target") {
            optWindowTarget = value;
        } else if (id === "engine-placeholder") {
            optEnginePlaceholder = value;
        } else if (id === "eval-mode") {
            optEvalMode = value;
        } else {
            continue;
        }
    }

    // Save to Chrome
    try {
        await saveSettings({
            enginesList: optEnginesList,
            windowTarget: optWindowTarget,
            enginePlaceholder: optEnginePlaceholder,
            evalMode: optEvalMode
        });
    } catch (error) {
        showError("Could not save settings", error);
    }

    // Errors
    if (enginesEmpty.length) {
        var msg = `Search Engine ${enginesEmpty} dosn't have an URL.\nIt will not work!`;
        if (enginesEmpty.length > 1)
            var msg = `Search Engine's ${beautifyArray(enginesEmpty)} don't have a URL.\nThey will not work!`;

        showError(msg);
    }
    if (enginesNoSpecial.length) {
        var msg = `Search Engine ${enginesNoSpecial} dosn't have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nIt will not work as expected!`
        if (enginesNoSpecial.length > 1)
            var msg = `Search Engine's ${beautifyArray(enginesNoSpecial)} don't have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nThey will not work as expected!`;

        showError(msg);
    }
}

function resetSettings() {
    document.getElementById("engines-container").innerHTML = "";
    displaySettings(DEFAULT_SETTINGS);
    saveSettingsForm();
}

function displaySettings(settings) {
    for (const engine of settings.enginesList) {
        addSearchEngine(engine.name, engine.url);
    }

    document.getElementById("window-target").value = settings.windowTarget;
    document.getElementById("engine-placeholder").value = settings.enginePlaceholder;
    document.getElementById("eval-mode").value = settings.evalMode;
}

function openInfoBox(infoId) {
    document.getElementById("inf-box-wrapper").classList.remove("display-none");
    document.getElementById(infoId).classList.remove("display-none");
    document.getElementById("inf-null-txt").classList.add("display-none");
}

function closeInfoBox() {
    const infBoxWrapper = document.getElementById("inf-box-wrapper");

    infBoxWrapper.classList.add("fade-out-short");
    infBoxWrapper.addEventListener("animationend", (e) => {
        infBoxWrapper.classList.remove("fade-out-short");
        infBoxWrapper.classList.add("display-none");

        for (const child of document.getElementById("inf-box").children)
            if (/^inf-.*-txt$/.test(child.id))
                child.classList.add("display-none");
        document.getElementById("inf-null-txt").classList.remove("display-none");
    }, {once: true});
}

function changeColorScheme(scheme = "dark") {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", scheme);
}
function toggleColorScheme() {
    const currentScheme = document.getElementsByTagName("html")[0].getAttribute("data-theme");
    changeColorScheme(currentScheme === "dark" ? "light" : "dark");
}

addEventListener("DOMContentLoaded", () => {
    loadSettings(DEFAULT_SETTINGS).then(displaySettings);
    populateDatalist(document.getElementById("engines-name-list"), Object.keys(ENGINES_DATALIST));
    populateDatalist(document.getElementById("engines-url-list"), Object.values(ENGINES_DATALIST));

    document.getElementById("engine-add-button").addEventListener("click", e => {addSearchEngine()});

    document.getElementById("inf-box-close-btn").addEventListener("click", e => {closeInfoBox()});
    document.getElementById("inf-box-bckrnd").addEventListener("click", e => {closeInfoBox()});
    document.getElementById("inf-box").addEventListener("click", e => {e.stopPropagation()});

    document.querySelectorAll(".inf-btn").forEach((infBtn) => {
        if (infBtn.classList.contains("hidden")) return;

        infBtn.addEventListener("keypress", e => {
            if (e.key === "Enter")
                openInfoBox(infBtn.id + "-txt");
        });
        infBtn.addEventListener("click", e => {
            openInfoBox(infBtn.id + "-txt");
        });
    })

    document.getElementById("settings-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveSettingsForm();
    });

    document.getElementById("settings-form").addEventListener("reset", async (e) => {
        e.preventDefault();
        resetSettings();
    })

    function goToShortcuts(active = true) {
        chrome.tabs.getCurrent(tab => {
            chrome.tabs.create({
                url: "chrome://extensions/shortcuts",
                active: active,
                index: tab.index +1
            }, (tabNew => {
                // Use Groupes if available
                if (tab.groupId >= 0) {
                    console.log(tab.groupId);
                    chrome.tabs.group({
                        tabIds: [tabNew.id],
                        groupId: tab.groupId}
                    );
                }
            }));
        });
    };

    document.getElementById("open-chrome-shortcuts").addEventListener("keypress", (e) => {
        e.preventDefault();

        if (e.key === "Enter")
            goToShortcuts(true);
    });

    document.getElementById("open-chrome-shortcuts").addEventListener("mousedown", (e) => {
        e.preventDefault();

        if (e.button === 0)
            goToShortcuts(true);
        if (e.button === 1)
            goToShortcuts(false);
    });

    document.getElementById("theme-toggle-btn").addEventListener("click", (e) => {
        toggleColorScheme();
    });

    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    changeColorScheme(prefersColorScheme.matches ? "dark" : "light");
    prefersColorScheme.addEventListener('change', event => {
        changeColorScheme(event.matches ? "dark" : "light");
    });
});
