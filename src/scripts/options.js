
// Global "Settings"
var SPECIAL_QUERY_PLACEHOLDER = "%s";

// Regex
const LAST_NUMBER = /(\d+)(?!.*\d)/

// ID Templates
const IDT_ENGINE = "engine-id-";
const IDT_ENGINE_NAME = "engine-name-";
const IDT_ENGINE_URL = "engine-url-";

function showError(msg) {
    alert(msg);
    console.log("ShortcutSearch: " + msg);
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
    const maxCount = 3;
    const container = document.getElementById("engines-container");
    const count = container.childElementCount + 1;

    if (count <= maxCount) {
        const newEngine = document.createElement("tr");
        newEngine.className = "engine";
        newEngine.id = IDT_ENGINE + count;
        newEngine.innerHTML = `
            <td class="engine-number">${count}.</td>
            <td class="engine-name"><input name="engine-name-${count}" id="${IDT_ENGINE_NAME}${count}" list="engines-name-list" value="${name}"></td>
            <td class="engine-url"><input name="engine-url-${count}" id="${IDT_ENGINE_URL}${count}" list="engines-url-list" value="${url}"></td>
        `;

        container.appendChild(newEngine);
    } else {
        alert(`You can only add a maximum of ${maxCount} search engines!`);
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
        await chrome.storage.sync.set({enginesList});
    } catch (error) {
        await chrome.storage.local.set({enginesList});
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

// --- addEventListener's ---

document.getElementById("engine-add-button").addEventListener("click", () => {
    addSearchEngine();
});

document.getElementById("settings-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    saveSettingsForm();
});