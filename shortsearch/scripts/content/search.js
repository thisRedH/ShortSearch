
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
        normalizeURL(url.replace(placeholderStr, encodingFunc(text))),
        "_blank",
        "noreferrer"
    );
}

function normalizeURL(url) {
    const pattern = /^((([a-z]*):)?\/{2})?|\/{2}/i;
    return "//" + url.replace(pattern, "");
}

// from https://stackoverflow.com/a/5717133/22279121
// changed https?: to ((https|http|ftp|file)?:)?
// removed {port and path}{query string}{fragment locator}
function validURL(str) {
    const pattern = new RegExp(
        '^(((https|http|ftp|file)?:)?\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'); // OR ip (v4) address
    return !!pattern.test(str);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === "search_selected_txt") {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) { return; }

        var url = message.searchURL;
        var queryText = selectedText;
        if (message.urlAutoEval) {
            try {
                url = (new URL(selectedText)).origin;
                queryText = "";
            } catch {
                if (message.urlAutoEval === "loose" && validURL(selectedText)) {
                    url = selectedText;
                    queryText = "";
                }
            }
        }

        searchText(
            url,
            queryText,
            "%s",
            "URIC"
        );
    }
});

//TODO: Popup when selected
