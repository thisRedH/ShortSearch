
if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    globalThis.browser = globalThis.chrome;
}

const LAST_NUMBER = /(\d+)(?!.*\d)/

/**
 * Formats an Array into a String with ", " and "and"
 * @param {Array} arr Input Array (item's should be number's or string's to look good)
 * @param {String} andFiller String to set before the last item (e.g. and, und, et, ...)
 * @returns {String} Formatted String
 */
function arrayToStringAndFiller(arr, andFiller = "and") {
    if (arr.length === 0) {
        return "";
    } else if (arr.length === 1) {
        return arr[0].toString();
    } else if (arr.length === 2) {
        return `${arr[0]} and ${arr[1]}`;
    } else {
        const lastItem = arr.pop();
        const joinedItems = arr.join(", ");
        return `${joinedItems} ${andFiller} ${lastItem}`;
    }
}

/**
 * Shows an error Message to the user
 * @param {String} msg 
 * @param {Error} err 
 */
function showError(msg, err = new Error(null)) {
    console.warn("ShortSearch: ", msg, '\n', err);
    alert(`${msg}\n${err}`);
}

/**
 * Shows an warn Message to the user
 * @param {String} msg 
 * @param {Error} err 
 */
function showWarn(msg, err = new Error(null)) {
    console.warn("ShortSearch: ", msg, '\n', err);
}

/**
 * 
 * @param {HTMLDataListElement} datalist 
 * @param {String[]} options 
 */
function populateDatalist(datalist, options) {
    for(let option of options) {
        const newOption = document.createElement("option");
        newOption.value = option;

        datalist.appendChild(newOption);
    }
}

/**
 * Loads Settings from browser.storage.sync, or saves default values if none exist.
 * @param {Object} defaultSettings - Fallback settings to save if none exist.
 * @returns {Promise<Object>} - The loaded settings.
 */
async function loadSettings(defaultSettings) {
    let settings = defaultSettings;

    try {
        const loadedSettings = await browser.storage.sync.get(null);
        settings = {...defaultSettings, ...loadedSettings};
    } catch (e) { }

    saveSettings(settings);
    return settings;
}

/**
 * Saves Settings into browser.storage.sync
 * @param {Object} settings 
 */
async function saveSettings(settings) {
    try {
        await browser.storage.sync.set(settings);
    } catch (e) {
        throw new Error("Could not save settings", e);
    }
}
