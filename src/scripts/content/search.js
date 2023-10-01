
function searchSelectedText(engine, placeholderStr = "%s") {
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
        var searchUrl = "";
        try {
            searchUrl = engine.replace(
                placeholderStr,
                encodeURIComponent(selectedText)
            );
        } catch (error) {
            searchUrl = encodeURIComponent(selectedText);
        }
        window.open(searchUrl, "_blank");
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === "search_selected_txt") {
        searchSelectedText(message.searchURL);
    }
});