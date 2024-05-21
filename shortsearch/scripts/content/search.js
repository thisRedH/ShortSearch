console.log("ShortSearch: Content Script loaded");

function normalizeURL(url) {
    const pattern = /^((([a-z]*):)?\/{2})?|\/{2}/i;
    return "http://" + url.replace(pattern, "");
}

const DOMAIN_PATTERN_STR = "(?:([\\p{L}\\d](?:[\\p{L}\\d-]*[\\p{L}\\d])*)\\.)+([\\p{L}]{2,})";
// from https://stackoverflow.com/a/36760050/22279121
const IPV4_PATTERN_STR = "((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\.?\\b){4}";
//TODO: ipv6 https://regex101.com/r/rB9pG1/1

// from https://stackoverflow.com/a/5717133/22279121
// changed to fit my needs
const VALIDATE_URL_SOFT = new RegExp(
    '^((?:(https|http|ftp|file)?:)?//)?'+ // protocol
    '('+ DOMAIN_PATTERN_STR +'|'+ IPV4_PATTERN_STR +')',
    'u'
);

// Same as VALIDATE_URL, but protocol detection is enforced
const VALIDATE_URL_STRICT = new RegExp(
    '^((https|http|ftp|file)://)'+ // protocol
    '('+ DOMAIN_PATTERN_STR +'|'+ IPV4_PATTERN_STR +')',
    'u'
);

function isValidUrl(url, validatePattern = VALIDATE_URL_STRICT) {
    const found = url.match(validatePattern);

    return (
        !!found && (
            !!found[6] /* valid ipv4 */ ||
            (globalThis.EXT_SHORTSEARCH_VALID_TLDS
                .indexOf(found[5]) > -1)
        )
    );
}

function getSelectionText() {
    const activeElement = document.activeElement;
    let selectedText = "";

    if (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT") {
        selectedText = activeElement.value.toString().substring(
            activeElement.selectionStart, 
            activeElement.selectionEnd
        );

        // Fallback for input types not supporting selectionStart/selectionEnd
        if (selectedText.trim() === "" && !!activeElement.value)
            selectedText = activeElement.value;
    } else {
        selectedText = window.getSelection().toString();
    }

    return selectedText.trim();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.event === "search_sel") {
    const selectedText = getSelectionText();
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
