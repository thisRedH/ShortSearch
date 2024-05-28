
const MSG_TYPES = {
    null: "NULL",
    undefined: "UNDEFINED",
    "info": "INFO",
    "warn": "ERROR",
    "err": "ERROR",
}

addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const qType = urlParams.get("t");
    const qMsg = urlParams.get("m");
    const typeStr = MSG_TYPES[qType];
    const msgStr = qMsg === null ? "NULL" : qMsg;

    let et = document.getElementById("msg-type");
    let em = document.getElementById("msg");

    et.innerText = typeStr;
    em.innerText = msgStr;
});
