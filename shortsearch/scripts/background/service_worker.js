
importScripts("../common/misc.js");

chrome.commands.onCommand.addListener(async (command, tab) => {
    if (command.startsWith("search_selected_txt")) {
        // Send message to content script
        try {
            const engineNumber = LAST_NUMBER.exec(command)[1];
            const enginesList = ((await chrome.storage.sync.get("enginesList")).enginesList);
            var engine = enginesList[engineNumber];

            if (!engine) {
                showWarn(`Engine ${engineNumber} does not exist! Using fallback engine 0`);
                engine = enginesList[0];
            }

            if (!engine) {
                showError("Search engine could not be loaded. Using google.com instead");
                engine = {"name": "Google", "url": "http://google.com/search?q=%s"};
            }

            await chrome.tabs.sendMessage(tab.id, {
                event: "search_selected_txt",
                searchURL: engine.url,
                urlAutoEval: "loose"    //TODO: load from save + implement in options
            });
        } catch(err) {
            showError(err.message);
        }
    }
});