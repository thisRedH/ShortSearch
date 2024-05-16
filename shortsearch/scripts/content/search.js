console.log("ShortSearch: Content Script loaded");

function normalizeURL(url) {
    const pattern = /^((([a-z]*):)?\/{2})?|\/{2}/i;
    return "http://" + url.replace(pattern, "");
}

// from https://stackoverflow.com/a/5717133/22279121
// changed to fit my needs
const VALIDATE_URL_SOFT = new RegExp(
    '^((?:(https|http|ftp|file)?:)?\/\/)?'+ // protocol
    '((?:([a-z\\d](?:[a-z\\d-]*[a-z\\d])*)\\.)+([a-z]{2,})|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
);

// Same as VALIDATE_URL, but protocol detection is enforced
const VALIDATE_URL_STRICT = new RegExp(
    '^((https|http|ftp|file):\/\/)'+ // protocol
    '((?:([a-z\\d](?:[a-z\\d-]*[a-z\\d])*)\\.)+([a-z]{2,})|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
);

function isValidUrl(url, validatePattern = VALIDATE_URL_STRICT) {
    const found = url.match(validatePattern);
    return (
        !!found &&
        globalThis.EXT_SHORTSEARCH_VALID_TLDS.indexOf(found[5]) > -1
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.event === "search_sel") {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) { return; }

    //TODO: add off
    const urlPattern = message.evalMode === "loose"
        ? VALIDATE_URL_SOFT
        : VALIDATE_URL_STRICT;

    if (!!message.evalMode && isValidUrl(selectedText, urlPattern)) {
        // selectedText is a url, now open it
        window.open(
            normalizeURL(selectedText),
            message.windowTarget
        );
    } else {
        window.open(
            normalizeURL(message.engineURL.replace(
                    message.enginePlaceholder,
                    encodeURIComponent(selectedText)
                )
            ),
            message.windowTarget
        );
    }
}});

//TODO: Popup [Search button] when selected
