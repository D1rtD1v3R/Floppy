// Replace with your existing Supabase values
const SUPABASE_URL = "https://fdadrbabrltenjscdfhn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYWRyYmFicmx0ZW5qc2NkZmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTgyOTgsImV4cCI6MjA4NzE5NDI5OH0.oF17odQgc9IveuqlmF1bsJCIi5Jqdtry4B8ppg-M3Jg";

const fragments = ["4142", "435A", "4C4B", "3334"];
let startTime = null;

// On page load, check disk ID and reveal next fragment
async function handleScan() {

    const disk = new URLSearchParams(window.location.search).get("disk");
    if (!disk) {
        document.getElementById("status").innerHTML = "No disk detected in URL. Use a valid NFC tag!";
        return;
    }

    if (!startTime) startTime = Date.now();

    // Check progress in Supabase
    const res = await fetch(`${SUPABASE_URL}/rest/v1/progress?disk=eq.${disk}`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await res.json();

    let scanCount = 0;

    if (data.length === 0) {
        // First scan for this disk
        await fetch(`${SUPABASE_URL}/rest/v1/progress`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({ disk: disk, scans: 1 })
        });
        scanCount = 1;
    } else {
        scanCount = data[0].scans + 1;
        await fetch(`${SUPABASE_URL}/rest/v1/progress?disk=eq.${disk}`, {
            method: "PATCH",
            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ scans: scanCount })
        });
    }

    revealFragment(scanCount);
}

function revealFragment(scanCount) {
    const output = document.getElementById("output");

    if (scanCount <= fragments.length) {
        output.innerHTML += `<p>Sector ${scanCount - 1} recovered:<br><strong>${fragments[scanCount - 1]}</strong></p>`;
    }

    if (scanCount >= fragments.length) {
        document.getElementById("decodeSection").style.display = "block";
        output.innerHTML += `<p>All sectors recovered. Decode the hex. Apply Caesar shift.</p>`;
    }
}

async function submitFlag() {
    const name = document.getElementById("playerName").value.trim();
    const flag = document.getElementById("flagInput").value.trim().toUpperCase();

    if (!name || !flag) { alert("Enter name and flag."); return; }

    if (flag === "DEFCON34") {
        const timeTaken = Date.now() - startTime;

        // Use your existing leaderboard.js submitSolve function
        submitSolve(name, 1, timeTaken);

        alert("Correct!");
        resetGame();

    } else {
        alert("Incorrect flag.");
    }
}

function resetGame() {
    document.getElementById("output").innerHTML = "";
    document.getElementById("decodeSection").style.display = "none";
    startTime = null;
}

// Run on page load
handleScan();
