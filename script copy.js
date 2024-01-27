// Global state variables
let currentMacro = 'presets'; // Default starting macro
let currentChannel = 'synth1'; // Default starting channel
let currentPage = 1; // Default starting page
let Data = {}; // Object to store JSON data
let selectedPad = null; // To keep track of the currently selected pad
let lastChannelClicked = "synth1"; // This will store the last channel clicked

//Load json
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    Data = data;
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
    const channelButtons = document.querySelectorAll('.channel-button');
    channelButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectChannel(this.id.replace('channel-', ''));
        });
    }); 
});
function selectChannel(channel) {
    lastChannelClicked = channel; // Should match the keys in Data.channels exactly
    highlightSelectedChannel(channel); // This function needs to be defined to highlight the selected channel
}

// Call this function when a pad button is clicked
function selectPad(padNumber) {
    // Make sure lastChannelClicked is set
    if (!lastChannelClicked) {
        console.error('No channel selected');
        return;
    }
    
    // Make sure the selected channel and macro are valid keys in the Data object
    if (Data.channels[lastChannelClicked] && Data.channels[lastChannelClicked][currentMacro]) {
        // Check if the page number is valid
        if (Data.channels[lastChannelClicked][currentMacro][`page${currentPage}`]) {
            selectedPad = padNumber;
            const padName = Data.channels[lastChannelClicked][currentMacro][`page${currentPage}`][padNumber - 1];
            document.getElementById('input-preset').value = padName;
        } else {
            console.error('Invalid page number:', currentPage);
        }
    } else {
        console.error('Invalid channel or macro:', lastChannelClicked, currentMacro);
    }
}

// Call this function when the user wants to save the edited name
function editPadName() {
    if (selectedPad === null || lastChannelClicked === null) {
        alert('No pad or channel selected');
        return;
    }
    const newValue = document.getElementById('input-preset').value;
    Data.channels[lastChannelClicked][currentMacro][`page${currentPage}`][selectedPad - 1] = newValue;
    updateButtonNames();
}

function highlightSelectedChannel(channel) {
    // Clear existing highlights
    const channelButtons = document.querySelectorAll('.channel-button');
    channelButtons.forEach(button => button.classList.remove('highlight'));

    // Highlight the selected channel
    const selectedButton = document.getElementById('channel-' + channel);
    if (selectedButton) {
        selectedButton.classList.add('highlight');
    }
}

// This function should be called to update the UI to reflect current data
function updateButtonNames() {
    const names = Data.channels[currentChannel][currentMacro][`page${currentPage}`];
    // Update the names for the pad buttons
    for (let i = 0; i < names.length; i++) {
        const buttonId = `pad-${i + 1}`;
        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = names[i];
            // Make sure the onclick event is set to call selectPad with the correct number
            button.onclick = function() { selectPad(i + 1); };
        }
    }
}

function downloadUpdatedData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Data, null, 2));
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
