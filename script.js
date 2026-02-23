// ---------------- CONFIG ----------------
const SUPABASE_URL = "https://fdadrbabrltenjscdfhn.supabase.co"";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYWRyYmFicmx0ZW5qc2NkZmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTgyOTgsImV4cCI6MjA4NzE5NDI5OH0.oF17odQgc9IveuqlmF1bsJCIi5Jqdtry4B8ppg-M3Jg";

// Final correct flag
const CORRECT_FLAG = "RECOVER_COMPLETE";

// Hex fragments (Caesar+3 encoded)
const fragments = [
  "55484652",
  "5948555F4652",
  "50534F485748"
];

// ---------------- SCAN LOGIC ----------------
let scanCount = parseInt(localStorage.getItem("scanCount") || "0");
scanCount++;
localStorage.setItem("scanCount", scanCount);

if(!localStorage.getItem("startTime")) {
  localStorage.setItem("startTime", Date.now());
}

const output = document.getElementById("output");
const submission = document.getElementById("submission");

if(scanCount <= fragments.length) {
  output.innerHTML = `
    Sector ${scanCount} recovered:<br><br>
    <b>${fragments[scanCount-1]}</b>
  `;
} else {
  output.innerHTML = `
    All sectors recovered.<br>
    Assemble fragments and decode.<br>
    Hint: Caesar shift = 3
  `;
  submission.style.display = "block";
}

// ---------------- SUBMIT LOGIC ----------------
document.getElementById("submitBtn").addEventListener("click", async () => {

  const name = document.getElementById("playerName").value.trim();
  const flag = document.getElementById("flagInput").value.trim().toUpperCase();
  const solveTime = Date.now() - parseInt(localStorage.getItem("startTime"));

  if(!name){
    alert("Enter a handle.");
    return;
  }

  if(flag === CORRECT_FLAG && scanCount >= fragments.length){
    await submitSolve(name, solveTime);
    alert("Firmware Restored.");
  } else {
    alert("Invalid flag.");
  }
});

// ---------------- LEADERBOARD ----------------
async function submitSolve(name, time) {
  await fetch(`${SUPABASE_URL}/rest/v1/solves`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      name,
      layer: "HEX-CAESAR",
      time_ms: time
    })
  });

  loadLeaderboard();
}

async function loadLeaderboard() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/solves?order=time_ms.asc`);
  const data = await res.json();

  let html = "<h3>Leaderboard</h3>";
  data.forEach(row => {
    html += `${row.name} | ${Math.floor(row.time_ms/1000)}s<br>`;
  });

  document.getElementById("leaderboard").innerHTML = html;
}

loadLeaderboard();
