// Initialize Ace Editor
const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);
editor.setOptions({
    fontSize: "14px",
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
});

// DOM Elements
const userInput = document.getElementById('userInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatMessages = document.getElementById('chatMessages');
const runCodeBtn = document.getElementById('runCodeBtn');
const saveCodeBtn = document.getElementById('saveCodeBtn');
const previewFrame = document.getElementById('previewFrame');
const refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
const fileExplorer = document.querySelector('.file-explorer');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize user
let currentUser = null;
let currentFile = 'server.js';
// Optimized function to render file structure
function renderFileExplorer(directoryData) {
    if (!directoryData) return;

    const fileExplorer = document.querySelector('.file-explorer');
    fileExplorer.innerHTML = ''; // Clear existing content
   for (const key in directoryData) {
    if (Object.prototype.hasOwnProperty.call(directoryData, key)) {
      const element = directoryData[key];
      console.log(element ,'element\n',key ,'key');
      
    }
   }
  }
  
 
  
// Initialize the application
async function init() {
    try {
        // await initUser();
        await loadPromptHistory();
        setupEventListeners();
        updatePreview();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}



// Load prompt history
async function loadPromptHistory() {
    try {
        const response = await fetch('/api/user/history');
        const data = await response.json();
        data.history.forEach(item => {
            addMessageToChat(item.prompt, 'user');
            addMessageToChat(item.response, 'ai');
        });
    } catch (error) {
        console.error('History loading error:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });

    // Send message
    sendMessageBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 200) + 'px';
    });

    // Code execution
    runCodeBtn.addEventListener('click', runCode);
    saveCodeBtn.addEventListener('click', saveCode);
    refreshPreviewBtn.addEventListener('click', updatePreview);

    // File management
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', () => switchFile(item));
    });

    // Editor changes
    editor.on('change', () => {
        if (document.querySelector('[data-tab="preview"]').classList.contains('active')) {
            updatePreview();
        }
    });
}

// Switch tabs
function switchTab(tabId) {
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-tab`);
    });

    if (tabId === 'preview') {
        updatePreview();
    }
}

// Switch files
function switchFile(fileItem) {
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
    });
    fileItem.classList.add('active');
    currentFile = fileItem.querySelector('span').textContent;
    // Load the content of the selected file into the editor
    loadFileContent(currentFile);
}

async function loadFileContent(fileName) {
    try {
        const response = await fetch('/api/file/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: fileName })
        });
        const data = await response.json();
        if (data.success && data.content) {
            editor.setValue(data.content);
            const fileExtension = fileName.split('.').pop();
            editor.session.setMode(`ace/mode/${fileExtension || 'javascript'}`);
        } else if (data.error) {
            console.error('Error loading file content:', data.error);
            editor.setValue('');
            editor.session.setMode('ace/mode/javascript'); // Default mode
        }
    } catch (error) {
        console.error('Error fetching file content:', error);
        editor.setValue('');
        editor.session.setMode('ace/mode/javascript'); // Default mode
    }
}

// Send message to AI
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessageToChat(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    try {
        const fetchResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,

            })
        });

        const data = await fetchResponse.json();
        console.log(data);

   // Update files section if directory_name exists
   if (data) {
    renderFileExplorer(data)


}


    } catch (error) {
        console.error('Chat error:', error);
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

// Add message to chat
function addMessageToChat(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    if (type === 'ai') {
        messageDiv.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="fas fa-robot text-blue-500 mr-2"></i>
                <span class="font-bold text-gray-700">AI Assistant</span>
            </div>
            <p class="text-gray-600">${message}</p>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="fas fa-user text-green-500 mr-2"></i>
                <span class="font-bold text-gray-700">You</span>
            </div>
            <p class="text-gray-600">${message}</p>
        `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Run code
async function runCode() {
    const code = editor.getValue();
    try {
        const response = await fetch('/api/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        if (data.error) {
            console.error(data.error);
        } else {
            updatePreview();
        }
    } catch (error) {
        console.error('Code execution error:', error);
    }
}

// Save code
async function saveCode() {
    const code = editor.getValue();
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                fileName: currentFile,
                userId: currentUser._id
            })
        });

        const data = await response.json();
        if (!data.success) {
            console.error('Failed to save code');
        }
    } catch (error) {
        console.error('Save error:', error);
    }
}

// Update preview
function updatePreview() {
    const code = editor.getValue();
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

    try {
        previewDoc.open();
        previewDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                </style>
            </head>
            <body>
                <script>${code}</script>
            </body>
            </html>
        `);
        previewDoc.close();
    } catch (error) {
        console.error('Preview error:', error);
    }
}

// Initialize the application
init();