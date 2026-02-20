const output = document.getElementById("output");

let scanCount = parseInt(localStorage.getItem("scanCount") || "0");
scanCount++;
localStorage.setItem("scanCount", scanCount);

// Start timer
if (!localStorage.getItem("startTime")) {
    localStorage.setItem("startTime", Date.now());
}

// Track firmware fragments
let fw = JSON.parse(localStorage.getItem("fw") || "[]");
fw.push(generateFragment(scanCount));
localStorage.setItem("fw", JSON.stringify(fw));

// Mild fingerprint
window.__firmwareHash = btoa(navigator.userAgent).substring(0, 8);

// Display progression
if (scanCount === 1) {
    output.innerHTML = "FIRMWARE CHECKSUM ERROR<br>Sector 0 unreadable.";
}
else if (scanCount === 2) {
    output.innerHTML = "Recovery mode enabled... Restoring sector 0.";
}
else if (scanCount === 3) {
    output.innerHTML = "Recovery complete.<br>Hidden partition mounted.";
    document.getElementById("fileArea").style.display = "block";
    document.getElementById("submission").style.display = "block";
}
else {
    output.innerHTML = "Firmware instability detected...";
    if (fw.length >= 6) {
        console.log("Integrity mismatch detected. Manual override required.");
    }
}

// Beginner flag display
function showFlag() {
    document.getElementById("flagContent").innerText =
        "UkVDT1ZFUl9DT01QTEVURQ==";
}

// Fragment generator (deterministic)
function generateFragment(scan) {
    const seed = "DEFCON34";
    const str = seed + scan;
    let hash = 0;
    for(let i=0;i<str.length;i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 1000000000;
    }
    let fragment = ("000000" + hash.toString(36)).slice(-6);
    return fragment.toUpperCase();
}

// Firmware reconstruction
function calculateFirmware() {
    let fw = JSON.parse(localStorage.getItem("fw") || "[]");
    return fw.join("");
}

// XOR helper
function xorDecode(str, key) {
    return str.split("").map(c =>
        String.fromCharCode(c.charCodeAt(0) ^ key)
    ).join("");
}

// Submission logic
function submitFlag() {
    let name = document.getElementById("playerName").value;
    let flag = document.getElementById("flagInput").value;
    let solveTime = Date.now() - parseInt(localStorage.getItem("startTime"));

    if (flag === "ADMIN_OVERRIDE") {
        alert("Nice try. Scan the hardware.");
        return;
    }

    if (solveTime < 15000) {
        alert("Firmware anomaly detected. Too fast.");
        return;
    }

    if (flag === "RECOVER_COMPLETE" && scanCount >= 3) {
        submitSolve(name, "A", solveTime);
        return;
    }

    // Elite layer
    let reconstructed = calculateFirmware();
    let decoded = xorDecode(reconstructed, 13);

    if (flag === decoded && fw.length >= 6) {
        submitSolve(name, "B", solveTime);
        return;
    }

    alert("Invalid flag.");

}
