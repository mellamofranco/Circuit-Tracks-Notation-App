// Global state variables
let currentMacro = 'presets'; // Default starting macro
let currentChannel = 'synth1'; // Default starting channel
let currentPage = 1; // Default starting page
let Data = {}; // Object to store JSON data


fetch('data.json')
  .then(response => response.json())
  .then(data => {
    Data = data;
    // Now Data contains your JSON data
    // Implement logic to display this data on your web page
  })
  .catch(error => console.error('Error loading JSON data:', error));

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and store the JSON data
    fetch('data.json') // Adjust the path if necessary
        .then(response => response.json())
        .then(data => {
            Data = data;
            updateButtonNames();
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // Event listeners for macro, channel, and page buttons
    document.getElementById('presetsBtn').addEventListener('click', () => setMacro('presets'));
    document.getElementById('patternsBtn').addEventListener('click', () => setMacro('patterns'));
    document.getElementById('prevPageBtn').addEventListener('click', () => setPage(currentPage - 1));
    document.getElementById('nextPageBtn').addEventListener('click', () => setPage(currentPage + 1));

    // Add event listeners for channel buttons if needed
});

function editPadName(padNumber) {
    const newValue = document.getElementById(`input-preset-${padNumber}`).value;
    padData.channels.synth1.presets.page1[padNumber - 1] = newValue;
    updateButtonNames();
    downloadUpdatedData();
}

function downloadUpdatedData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(padData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function copyDataToClipboard() {
    const dataStr = JSON.stringify(Data, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
        alert("Data copied to clipboard!");
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
    }


function updateButtonNames() {
    const names = Data.channels[currentChannel][currentMacro][`page${currentPage}`];
    // Update the names for the 32 buttons
    for (let i = 0; i < 32; i++) {
        const buttonId = `pad-${i + 1}`; // IDs are 'pad-1', 'pad-2', etc.
        const button = document.getElementById(buttonId);
        if (button && names[i]) {
            button.textContent = names[i];
        }
    }
}

function setMacro(macro) {
    currentMacro = macro;
    updateButtonNames();
}

function setPage(page) {
    if (page >= 1 && page <= 2) { // Assuming 2 pages
        currentPage = page;
        updateButtonNames();
        document.getElementById('currentPageDisplay').textContent = `Current page: ${page}`;
    }
}

// Additional functions for setting the channel can be added here
