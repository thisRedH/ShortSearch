if (typeof importScripts !== 'undefined') {
    importScripts("../common/misc.js", "../common/data.js");
}

chrome.commands.onCommand.addListener(async (command, tab) => {
if (command.startsWith("search_selected_txt")) {
    // Send message to content script
    try {
        const engineNumber = LAST_NUMBER.exec(command)[1];
        const settings = await loadSettings(DEFAULT_SETTINGS);
        var engine = settings.enginesList[engineNumber];

        if (!engine) {
            showWarn(`Engine ${engineNumber} does not exist! Using fallback engine 0`);
            engine = settings.enginesList[0];
        }

        if (!engine) {                          //TODO: Use error screen (make error.html)
            showError("Search engine could not be loaded. Using google.com instead");
            engine = {"name": "Google", "url": "http://google.com/search?q=%s"};
        }

        await chrome.tabs.sendMessage(tab.id, {
            event: "search_sel",
            engineURL: engine.url,
            windowTarget: settings.windowTarget,
            enginePlaceholder: settings.enginePlaceholder,
            evalMode: settings.evalMode,
        });
    } catch(err) {
        console.warn(err);
    }
}});
