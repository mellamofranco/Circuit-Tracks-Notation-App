let Data = {}; // Initially empty
let currentMacro = 'presets';
let currentChannel = 'synth1';
let currentPage = 1;
let selectedPad = null;
let lastChannelClicked = 'synth1';
let project = 'data_(1).json'




// Load JSON data
function loadData() {
    fetch(project)
        .then(response => response.json())
        .then(data => {
            Data = data;
            initApp(); // Initialize the app after data is loaded
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

// Initialize the app
function initApp() {
    setMacro('presets'); // This will also update the button names and apply highlighting
    
    // Set up event listeners for buttons
    document.getElementById('presetsBtn').addEventListener('click', () => setMacro('presets'));
    document.getElementById('patternsBtn').addEventListener('click', () => setMacro('patterns'));
    document.getElementById('prevPageBtn').addEventListener('click', () => setPage(currentPage - 1));
    document.getElementById('nextPageBtn').addEventListener('click', () => setPage(currentPage + 1));

    const channelButtons = document.querySelectorAll('.channel-button');
    channelButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectChannel(this.id.replace('channel-', ''));
        });
    });
}

// Call loadData when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadData);

function selectChannel(channel) {
    lastChannelClicked = channel;
    highlightSelectedChannel(channel);
    updateButtonNames(); // Refresh button names to reflect the newly selected channel
}

function selectPad(padNumber) {
    selectedPad = padNumber;
    const padName = Data.channels[lastChannelClicked][currentMacro][`page${currentPage}`][padNumber - 1];
    document.getElementById('input-preset').value = padName;
}

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
    const channelButtons = document.querySelectorAll('.channel-button');
    channelButtons.forEach(button => button.classList.remove('highlight'));

    const selectedButton = document.getElementById('channel-' + channel);
    if (selectedButton) {
        selectedButton.classList.add('highlight');
    }
}

function updateButtonNames() {
    const names = Data.channels[lastChannelClicked][currentMacro][`page${currentPage}`];
    for (let i = 0; i < names.length; i++) {
        const buttonId = `pad-${i + 1}`;
        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = names[i];
            button.onclick = function() { selectPad(i + 1); };
        }
    }
}

function downloadUpdatedData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
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

    const presetsBtn = document.getElementById('presetsBtn');
    const patternsBtn = document.getElementById('patternsBtn');

    if (currentMacro === 'presets') {
        presetsBtn.classList.add('highlight');
        patternsBtn.classList.remove('highlight');
    } else if (currentMacro === 'patterns') {
        patternsBtn.classList.add('highlight');
        presetsBtn.classList.remove('highlight');
    }
}

function setPage(page) {
    if (page >= 1 && page <= 2) {
        currentPage = page;
        updateButtonNames();
        const currentPageDisplay = document.getElementById('currentPageDisplay');
        currentPageDisplay.textContent = `Current page: ${page}`;

        if (currentPage === 2) {
            currentPageDisplay.classList.add('page-active');
        } else {
            currentPageDisplay.classList.remove('page-active');
        }
    }
}
