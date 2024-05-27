console.log("ShortSearch: Content Script loaded");

if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    globalThis.browser = globalThis.chrome;
}

const VALID_TLDS = globalThis.EXT_SHORTSEARCH_VALID_TLDS;
// based on https://stackoverflow.com/a/5717133/22279121
const DOMAIN_PATTERN = /(?:([\p{L}\d](?:[\p{L}\d-]*[\p{L}\d])*)\.)+([\p{L}]{2,})/u;
// from https://stackoverflow.com/a/36760050/22279121
const IPV4_PATTERN = /(?:(?:25[0-5]|(?:2[0-4]|1\d|[1-9]|)\d)\.?\b){4}/;
//FIXME: ipv6 https://regex101.com/r/rB9pG1/1
const IPV6_PATTERN = /(?:)/;

const VALIDATE_URL_SOFT = new RegExp(
    '^((?:(https|http|ftp|file)?:)?//)?'+ // protocol
    '(('+ DOMAIN_PATTERN.source +
    ')|('+ IPV4_PATTERN.source +
    ')|('+ IPV6_PATTERN.source +'))',
    'u'
);

// Same as VALIDATE_URL, but protocol detection is enforced
const VALIDATE_URL_STRICT = new RegExp(
    '^((https|http|ftp|file)://)'+ // protocol
    '(('+ DOMAIN_PATTERN.source +
    ')|('+ IPV4_PATTERN.source +
    ')|('+ IPV6_PATTERN.source +'))',
    'u'
);

function isValidUrl(url, validatePattern = VALIDATE_URL_STRICT) {
    const found = url.match(validatePattern);
    if (!found) {return false;}

    const protocol = found[2];
    const domain = found[4];
    const tld = found[6];
    const ipv4 = found[7];
    const ipv6 = found[8];

    return (
        (ipv6) ||
        (ipv4) ||
        (domain && VALID_TLDS.indexOf(tld) > -1)
    );
}

function normalizeURL(url, protocol = "http://") {
    const pattern = /^((([a-z]*):)?\/{2})?|\/{2}/i;
    return protocol + url.replace(pattern, "");
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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
