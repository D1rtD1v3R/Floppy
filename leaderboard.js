const SUPABASE_URL = "https://fdadrbabrltenjscdfhn.supabase.co";
const SUPABASE_KEY = "sb_publishable_781A6kZECyII1czXFDPSFA_nhwOXzkD";

async function submitSolve(name, layer, time) {
    await fetch(`${SUPABASE_URL}/rest/v1/solves`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({
            name,
            layer,
            time_ms: time,
            disk: new URLSearchParams(window.location.search).get("disk"),
            hash: window.__firmwareHash
        })
    });

    loadLeaderboard();
}

async function loadLeaderboard() {
    let res = await fetch(`${SUPABASE_URL}/rest/v1/solves?order=time_ms.asc`);
    let data = await res.json();

    let html = "<h3>Leaderboard</h3>";
    data.forEach(row => {
        html += `${row.name} | Layer ${row.layer} | ${row.time_ms}ms<br>`;
    });

    document.getElementById("leaderboard").innerHTML = html;
}

loadLeaderboard();
