
// Global "Settings"
var SPECIAL_QUERY_PLACEHOLDER = "%s";

// Regex
const LAST_NUMBER = /(\d+)(?!.*\d)/

// ID Templates
const IDT_ENGINE = "engine-id-";
const IDT_ENGINE_NAME = "engine-name-";
const IDT_ENGINE_URL = "engine-url-";

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

var searchEngineOnPos = [];

document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();

    let formData = new FormData(document.getElementById("settings-form"));
    var searchEnginesInput = {};
    for (let pair of formData.entries()) {
        if (pair[0].startsWith(IDT_ENGINE_NAME)) {
            const engineIDNumber = LAST_NUMBER.exec(pair[0])[1];

            const nameData = pair[1];
            const urlData = formData.get(IDT_ENGINE_URL + engineIDNumber);

            if (!urlData.includes(SPECIAL_QUERY_PLACEHOLDER)) {
                alert(
                    `Search Engine number ${document.querySelector(`#${IDT_ENGINE}${engineIDNumber} > td.engine-number`).innerText} does not have a Placehoder (${SPECIAL_QUERY_PLACEHOLDER}) in the URL.\nIt will not work as expected!`
                )
            }

            let engine = {
                name: nameData,
                url: urlData,
            };
        }
    }
    console.log(formData);
    console.log(Object.fromEntries(formData));
});