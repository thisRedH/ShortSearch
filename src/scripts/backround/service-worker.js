
const LAST_NUMBER = /(\d+)(?!.*\d)/

chrome.commands.onCommand.addListener(async (command, tab) => {
    if (command.startsWith("search_selected_txt")) {
        // Send message to content script
        try {
            const engineNumber = LAST_NUMBER.exec(command)[1];
            const enginesList = ((await chrome.storage.sync.get("enginesList")).enginesList);
            var engine = "http://google.com/search?q=%s";
            try {
                engine = enginesList[engineNumber];
            } catch (error) {
                console.warn(`Engine ${engineNumber} does not exist! Using fallback engine 0`);
                engine = enginesList[0];
            }
            
            if (!typeof engine === 'string' || !engine instanceof String) {
                console.warn(`Engine could not be loaded. Using google.com instead`);
                engine = "http://google.com/search?q=%s";
            }

            await chrome.tabs.sendMessage(tab.id, {
                event: "search_selected_txt",
                searchURL: engine.url,
            });
        } catch(err) {
            console.warn("ShortcutSearch:", err.message);
        }
    }
});