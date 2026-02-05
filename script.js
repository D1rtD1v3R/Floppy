let scans = localStorage.getItem("floppy_scans");
if (!scans) scans = 0;
scans = parseInt(scans);

const output = document.getElementById("output");

function print(msg){
  output.innerHTML += msg + "<br>";
}

function scan(){
  scans++;
  localStorage.setItem("floppy_scans", scans);

  output.innerHTML = "";

  print("Scanning disk...");
  print("Recovered sector integrity: " + (scans * 17) + "%");

  if(scans < 3){
    print("Disk unstable. Re-scan required.");
    print("Hint: repeated scans improve recovery.");
  }

  else if(scans === 3){
    print("<br>✔PARTIAL DIRECTORY RECOVERED");
    print("Hidden partition detected...");
    print("Continue scanning.");
  }

  else if(scans < 5){
    print("<br>Reconstructing FAT...");
    print("More passes required.");
  }

  else if(scans >= 5){
    print("<br>✔FULL RECOVERY COMPLETE");
    print("Filesystem mounted.");
    print("<br>PASSWORD RECOVERED: <b>sector7</b>");
    print("<br><a href='stage2.html'>Mount recovered filesystem</a>");
  }
}

//THIS is the key line for NFC multi-scan
window.onload = scan;
