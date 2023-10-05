
function searchText(url, text, placeholderStr, encoding = "URIC") {
    const encodingFunc = (() => {
        switch (encoding) {
            case "NONE":
                return (s) => { return s; };
            case "URI":
                return encodeURI;
            case "URIC":
                return encodeURIComponent;
            case "B64":
                return btoa;
            case "HEX":
                return (s) => {
                    return s.split("")
                        .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
                        .join("");
                };
            default:
                return encodeURIComponent;
        }
    })();

    window.open(
        url.replace(placeholderStr, encodingFunc(text)),
        "_blank"
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === "search_selected_txt") {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) { return; }

        searchText(
            message.searchURL,
            selectedText,
            "%s",
            "HEX"
        );
    }
});

//TODO: Popup when selected
