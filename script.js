let scanner;

function startScan() {
    document.getElementById("reader").style.display = "block";

    scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250
    });

    scanner.render(onScanSuccess, onScanError);
}

async function onScanSuccess(qrMessage) {
    console.log("Scanned QR Code:", qrMessage);
    scanner.clear();
    document.getElementById("reader").style.display = "none";

    // Send the scanned flat number to FastAPI backend
    fetch(`http://127.0.0.1:8000/deduct_member/${qrMessage}`, {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("status").innerText = "✅ Member deducted successfully!";
        } else {
            document.getElementById("status").innerText = "❌ Error: " + data.error;
        }
    })
    .catch(error => {
        document.getElementById("status").innerText = "❌ Failed to connect to server.";
    });
}

async function onScanError(errorMessage) {
    console.warn(errorMessage);
}