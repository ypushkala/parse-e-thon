// Function to send text input
function sendTextInput() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        displayUserMessage(userInput);
        fetchCharacterResponse(userInput);
        document.getElementById('user-input').value = ''; // Clear input field
    }
}

// Function to display user's text in the chat window
function displayUserMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const userMessage = document.createElement('div');
    userMessage.classList.add('message');
    userMessage.classList.add('user');
    userMessage.textContent = message;
    chatWindow.appendChild(userMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to fetch character response
function fetchCharacterResponse(userInput) {
    fetch('/get_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: userInput })
    })
    .then(response => response.json())
    .then(data => {
        displayBotResponse(data.character, data.response);
    })
    .catch(error => console.error('Error:', error));
}

// Function to display bot's response in the chat window
function displayBotResponse(character, response) {
    const chatWindow = document.getElementById('chat-window');
    const botMessage = document.createElement('div');
    botMessage.classList.add('message');
    botMessage.classList.add('bot');
    botMessage.textContent = `${character}: ${response}`;
    chatWindow.appendChild(botMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    openModal(character, response);
}

// Open modal to display character response
function openModal(character, response) {
    document.getElementById('response-title').textContent = character;
    document.getElementById('response-text').textContent = response;
    document.getElementById('response-modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('response-modal').style.display = 'none';
}

// Function to start voice recognition
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        const voiceInput = event.results[0][0].transcript;
        document.getElementById('user-input').value = voiceInput;
        sendTextInput();
    };

    recognition.onerror = function(event) {
        console.log("Error occurred in speech recognition: " + event.error);
    };
}
