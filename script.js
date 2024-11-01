let port;
let writer;

document.getElementById("connectBtn").addEventListener("click", async () => {
  try {
    // Request a port and open a connection
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    document.getElementById("message").textContent = "Connected at 9600 bps";

    // Enable the button to send sensor data
    document.getElementById("sendSensorDataBtn").disabled = false;

    // Set up writer for sending data
    const textEncoder = new TextEncoderStream();
    textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
  } catch (error) {
    document.getElementById("message").textContent = `Connection failed: ${error.message}`;
  }
});

// Generate and send mock sensor data
document.getElementById("sendSensorDataBtn").addEventListener("click", async () => {
  if (writer) {
    // Simulate sensor data
    const sensorData = {
      temperature: (Math.random() * 10 + 20).toFixed(2), // Mock temperature between 20-30 °C
      humidity: (Math.random() * 20 + 40).toFixed(2),    // Mock humidity between 40-60%
      timestamp: new Date().toISOString()
    };

    // Send JSON string of sensor data
    await writer.write(JSON.stringify(sensorData) + "\n");
    document.getElementById("message").textContent = `Sent: ${JSON.stringify(sensorData)}`;
  }
});
