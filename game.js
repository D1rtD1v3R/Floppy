// Supabase credentials
// const SUPABASE_URL = "https://fdadrbabrltenjscdfhn.supabase.co";
// const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYWRiYmFicmx0ZW5qc2NkZmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTgyOTgsImV4cCI6MjA4NzE5NDI5OH0.oF17odQgc9IveuqlmF1bsJCIi5Jqdtry4B8ppg-M3Jg";

// Hex fragments to reveal
const fragments = ["4142", "435A", "4C4B", "3334"];
let startTime = null;

window.addEventListener("DOMContentLoaded", () => {
    handleScan();
});

async function handleScan() {
    const urlParams = new URLSearchParams(window.location.search);
    const disk = urlParams.get("disk");
    const player = urlParams.get("player") || "Anonymous";

    if (!disk) {
        document.getElementById("status").innerText = "No disk ID in URL!";
        return;
    }

    if (!startTime) startTime = Date.now();

    try {
        // Query solves table for this disk + player
        const diskParam = encodeURIComponent(disk);
        const playerParam = encodeURIComponent(player);

        const res = await fetch(`${SUPABASE_URL}/rest/v1/solves?disk=eq.'${diskParam}'&name=eq.'${playerParam}'`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        const data = await res.json();
        console.log("Query result:", data); // Debug

        const scanCount = data.length;

        if (scanCount < fragments.length) {
            // Reveal next fragment
            revealFragment(scanCount);

            // Insert a new row to track this scan
            await fetch(`${SUPABASE_URL}/rest/v1/solves`, {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    name: player,
                    layer: scanCount + 1,
                    time_ms: null,
                    disk: disk,
                    hash: "scan"
                })
            });
        } else {
            // All fragments recovered
            document.getElementById("decodeSection").style.display = "block";
            document.getElementById("output").innerHTML += `<p>All sectors recovered. Decode the hex. Apply Caesar shift.</p>`;
        }

    } catch (err) {
        console.error("Supabase error:", err);
        document.getElementById("status").innerText = "Error accessing database. Check console.";
    }
}

function revealFragment(index) {
    const output = document.getElementById("output");
    output.innerHTML += `<p>Sector ${index} recovered:<br><strong>${fragments[index]}</strong></p>`;
}

async function submitFlag() {
    const name = document.getElementById("playerName").value.trim();
    const flag = document.getElementById("flagInput").value.trim().toUpperCase();

    if (!name || !flag) { alert("Enter name and flag."); return; }

    if (flag === "DEFCON34") {
        const timeTaken = Date.now() - startTime;

        // Use your existing leaderboard.js function
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
