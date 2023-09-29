
function addSearchEngine() {
    const maxCount = 3;
    const container = document.getElementById("engies-container");
    const count = container.childElementCount + 1;

    if (count <= maxCount) {
        const newEngine = document.createElement("tr");
        newEngine.className = "engine";
        newEngine.innerHTML = `
            <td class="engine-number">${count}.</td>
            <td class="engine-name"><input name="engine-name-${count}" id="engine-name-${count}" list="engines-name-list" value=""></td>
            <td class="engine-url"><input name="engine-url-${count}" id="engine-url-${count}" list="engines-url-list" value=""></td>
        `;

        container.appendChild(newEngine);
    } else {
        alert(`You can only add a maximum of ${maxCount} search engines!`);
    }
}
