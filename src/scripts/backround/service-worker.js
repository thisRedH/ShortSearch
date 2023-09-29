

chrome.commands.onCommand.addListener(async (command, tab) => {
    if (command.startsWith("search_selected_txt")) {
        // Send message to content script
        try {
            const lastNumber = /(\d+)(?!.*\d)/gm;
            const engineNumber = command.match(lastNumber);

            await chrome.tabs.sendMessage(tab.id, {
                event: "search_selected_txt",
                searchEngine: "https://www.bing.com/search?q=%s"              //TODO: load searchEngine from config
            });
        } catch(err) {
            console.warn("ShortcutSearch:", err.message);
        }
    }
});