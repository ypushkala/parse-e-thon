// Function to handle sign-in form submission
document.getElementById('sign-in-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get email and password values
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    // Simulate successful sign-in by checking if email and password are not empty
    if (email && password) {
        // Simulate successful login (In a real case, you'd validate against a backend service)
        alert("Sign-in successful!");

        // Redirect to the homepage after successful login
        window.location.href = '/index.html';
    } else {
        alert("Please enter valid email and password!");
    }
});

// Get the selected character from localStorage
const character = localStorage.getItem('selectedCharacter');

// Define character descriptions
const characterDescriptions = {
    'muscle-mike': "A fitness enthusiast with a tough, but friendly attitude.",
    'melody-mimi': "A music lover with a creative and artistic spirit.",
    'van-gogh-vinny': "An artist with a passion for painting and deep philosophy.",
    'sonnet-sammy': "A poetic soul who loves to write and talk about deep emotions.",
    'corporate-charlie': "A professional business person, always focused on success and productivity.",
    'entrepreneur-ella': "A go-getter who loves to build new businesses and innovate.",
    'chef-chow': "A master of the culinary arts, passionate about food and cooking.",
    'lounging-larry': "A laid-back, easy-going individual who loves to relax and enjoy life."
};

// Display the selected character's name and description
if (character) {
    document.getElementById("character-name").textContent = character.replace(/-/g, ' ').toUpperCase();
    document.getElementById("character-description").textContent = characterDescriptions[character];
} else {
    document.getElementById("character-name").textContent = "No character selected!";
    document.getElementById("character-description").textContent = "Please go back and select a character.";
}

// Function to send text input
function sendTextInput() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        displayUserMessage(userInput); // Display user's message in chat window
        fetchCharacterResponse(userInput); // Fetch and display character's response
        document.getElementById('user-input').value = ''; // Clear input field after sending
    }
}

// Function to display user's message in the chat window
function displayUserMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const userMessage = document.createElement('div');
    userMessage.classList.add('message');
    userMessage.classList.add('user');
    userMessage.textContent = message;
    chatWindow.appendChild(userMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the bottom
}

// Function to fetch character response
function fetchCharacterResponse(userInput) {
    fetch('http://127.0.0.1:5506/generate_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ character: character, user_input: userInput })
    })
    .then(response => response.json())
    .then(data => {
        displayBotResponse(data.response); // Display bot's response in chat
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Sorry, there was an error processing your request.");
    });
}

// Function to display bot's response in the chat window
function displayBotResponse(response) {
    const chatWindow = document.getElementById('chat-window');
    const botMessage = document.createElement('div');
    botMessage.classList.add('message');
    botMessage.classList.add('bot');
    botMessage.textContent = `${character.replace(/-/g, ' ')}: ${response}`;
    chatWindow.appendChild(botMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the bottom

    // Create a Cancel button to allow re-entry of input
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-btn');
    cancelButton.textContent = 'Cancel (Wrong)';
    cancelButton.onclick = function() {
        // Clear the previous input and allow the user to enter a new message
        document.getElementById('user-input').value = ''; // Clear the input field
        botMessage.remove(); // Remove the previous response
        cancelButton.remove(); // Remove the Cancel button
        document.getElementById('user-input').focus(); // Focus the input field
    };

    // Add the Cancel button next to the bot's response
    chatWindow.appendChild(cancelButton);

    // Auto-scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
    openModal(character, response); // Open modal with the response
}

// Open modal to display character response
function openModal(character, response) {
    document.getElementById('response-title').textContent = character.replace(/-/g, ' ').toUpperCase();
    document.getElementById('response-text').textContent = response;
    document.getElementById('response-modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('response-modal').style.display = 'none';
}

// Modal functionality for closing the modal
const modal = document.getElementById("response-modal");
const closeModalButton = document.getElementById("close-modal");

closeModalButton.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
