document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const chatBox = document.getElementById('chat-box');
    const voiceBtn = document.getElementById('voice-btn');
    const promptInput = document.getElementById('prompt');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userPrompt = promptInput.value;
        addMessage('user', userPrompt);

        // Send the message to the backend API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt })
        });

        const data = await response.json();
        addMessage('bot', data.response);
        promptInput.value = '';  // Clear the input after sending
    });

    voiceBtn.addEventListener('click', () => {
        // Check if the browser supports speech recognition
        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support speech recognition.');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';  // Set the language
        recognition.continuous = false;  // Stop automatically after recognizing speech
        recognition.interimResults = false;  // Do not show interim results

        recognition.onstart = () => {
            console.log("Voice recognition started. Speak now.");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;  // Get the recognized text
            promptInput.value = transcript;  // Fill the input with recognized text
            console.log("Voice recognized: ", transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error: ", event.error);
            alert("Speech recognition error: " + event.error);
        };

        recognition.onend = () => {
            console.log("Speech recognition ended.");
        };

        recognition.start();  // Start listening for voice input
    });

    function addMessage(sender, message) {
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', sender);
        messageElem.textContent = message;
        chatBox.appendChild(messageElem);
    }
});