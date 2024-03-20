
const ENGINES_DATALIST = {
    // General Search engines
    "Google":       "http://google.com/search?q=%s",
    "Bing":         "http://bing.com/search?q=%s",
    "Yahoo":        "http://search.yahoo.com/search?p=%s",
    "DuckDuckGo":   "http://duckduckgo.com/?q=%s",
    "Ecosia":       "https://www.ecosia.org/search?q=%s",
    "Startpage":    "https://www.startpage.com/do/dsearch?query=%s",
    "Baidu":        "http://baidu.com/s?wd=%s",
    "Yandex":       "http://yandex.com/search/?text=%s",
    "Ask.com":      "http://ask.com/web?q=%s",
    "AOL Search":   "http://search.aol.com/aol/search?q=%s",
    "Excite":       "http://results.excite.com/serp?q=%s",
    "All the Internet":     "http://alltheinternet.com/?q=%s",
    "Lycos":        "http://search.lycos.com/web/?q=%s",
    "Dogpile":      "http://dogpile.com/search/web?q=%s",
    "Swisscows":    "http://swisscows.com/web?query=%s",
    "Mojeek":       "http://mojeek.com/search?q=%s",
    "Naver":        "http://search.naver.com/search.naver?query=%s",
    "Seznam":       "http://search.seznam.cz/?q=%s",
    "Qwant":        "http://qwant.com/?q=%s",

    // Encyclopedia
    "Wikipedia":    "http://wikipedia.org/wiki/%s",
    "Citizendium":  "http://citizendium.org/wiki/%s",
    "encyclopedia": "http://encyclopedia.com/gsearch?q=%s",

    // TV
    "TMDB":         "http://themoviedb.org/search?query=%s",
    "IMDb":         "http://imdb.com/find/?q=c",

    // Social Media
    "Youtube":      "http://youtube.com/results?search_query=%s",
    "Reddit":       "http://reddit.com/search/?q=%s",
    "Reddit Old":   "http://old.reddit.com/search/?q=%s",
    "Twitter":      "http://twitter.com/search?q=%s",
    "X":            "http://x.com/search?q=%s",
    "Facebook":     "http://facebook.com/search/?q=%s",
    "TikTok":       "http://tiktok.com/search?q=%s",
    "Pinterest":    "http://pinterest.com/search/?q=%s",

    // Shops
    "Amazon":       "http://amazon.com/s?k=%s",
    "ebay":         "http://ebay.com/sch/i.html?_nkw=%s",
    "Walmart":      "http://walmart.com/search?q=%s",
    "Newegg":       "http://newegg.com/p/pl?d=%s",
    "Facebook Marketplace": "http://facebook.com/marketplace/search/?query=%s",

    // PC/Coding Stuff
    "Stack Overflow":   "http://stackoverflow.com/search?q=%s",
    "Stack Exchange":   "http://stackexchange.com/search?q=%s",
    "DevDocs":      "http://devdocs.io/#q=%s",
    "Github":       "http://github.com/search?q=%s",
    "PCPartPicker": "http://pcpartpicker.com/search/?q=%s",
    "Geizhals":     "http://geizhals.de/?fs=%s",

    // Game Stuff
    "Steam":        "http://steampowered.com/search/?term=%s",
    "GOG":          "http://gog.com/games?query=%s",

    // Special
    "The Pirate Bay":   "http://thepiratebay10.org/search/%s",
}

const DEFAULT_SETTINGS = {
    "enginesList": [
        {"name": "Google",          "url": ENGINES_DATALIST["Google"]},
        {"name": "DuckDuckGo",      "url": ENGINES_DATALIST["DuckDuckGo"]},
        {"name": "Youtube",         "url": ENGINES_DATALIST["Youtube"]},
        {"name": "Wikipedia",       "url": ENGINES_DATALIST["Wikipedia"]},
        {"name": "Stack Overflow",  "url": ENGINES_DATALIST["Stack Overflow"]},
    ],
    "windowTarget": "_blank",
    "enginePlaceholder": "%s",
    "evalMode": "loose"
}
