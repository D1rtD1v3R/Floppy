let scans = localStorage.getItem("floppy_scans");
if (!scans) scans = 0;
scans = parseInt(scans);

const output = document.getElementById("output");

function print(msg){
  output.innerHTML += msg + "<br>";
}

print("Insert disk and run recovery.");

function scan(){
  scans++;
  localStorage.setItem("floppy_scans", scans);

  output.innerHTML = "";

  print("Scanning disk...");
  print("Recovered sector: " + (scans * 12) + "%");

  if(scans < 3){
    print("Disk unstable. Re-scan required.");
    print("Hint: multiple passes improve recovery.");
  }

  if(scans === 3){
    print("<br>✔ PARTIAL DIRECTORY RECOVERED");
    print("Hidden partition detected...");
  }

  if(scans === 5){
    print("<br>✔ FULL RECOVERY COMPLETE");
    print("Filesystem mounted.");
    print("<br>PASSWORD: <b>sector7</b>");
    print("<br><a href='stage2.html'>Open recovered filesystem</a>");
  }
}
