
function addSearchEngine() {
    const maxCount = 15;
    const container = document.getElementById("search-engines-container");
    const searchEngines = container.getElementsByClassName("search-engine");
    const count = searchEngines.length + 1;

    if (count <= maxCount) {
        const newLine = document.createElement("div");
        newLine.className = "search-engine";
        newLine.innerHTML = `
            <div class="engine-number">${count}.</div>
            <input type="text" class="engine-name" id="engine-name-${count}" name="engine-name-${count}" placeholder="Name" required>
            <input type="url" class="engine-url" id="engine-url-${count}" name="engine-url-${count}" placeholder="https://foo.com/search?q=%s" required>
        `;

        container.appendChild(newLine);
    } else {
        alert(`You can only add a maximum of ${maxCount} search engines!`);
    }
}

document.getElementById("search-engine-add").addEventListener("click", addSearchEngine);
