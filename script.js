'use strict';

let port;
let writer;

// document.getElementById("connectBtn").addEventListener("click", async () => {
//   try {
//     // Request a USB device with specific vendor and product IDs (use generic filter if you don't know them)
//     device = await navigator.usb.requestDevice({ filters: [{ }] }); // Replace with your device's vendor ID

//     // Open the device connection
//     await device.open();
//     if (device.configuration === null) {
//       await device.selectConfiguration(1); // Select the first configuration if none is set
//     }

//     // Claim the interface (0 is often the default interface for many devices)
//     await device.claimInterface(0);

//     document.getElementById("message").textContent = "Connected to device: " + device.productName;
//     document.getElementById("sendDataBtn").disabled = false;
//   } catch (error) {
//     document.getElementById("message").textContent = `Connection failed: ${error.message}`;
//   }
// });

document.getElementById("connectBtn").addEventListener("click", async () => {
  try {
    // Request a port and open a connection
    port = await navigator.serial.requestPort({ filters: [{ usbVendorId: 0x10C4}] });
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
