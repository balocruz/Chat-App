const socket = io("http://localhost:8000");

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageContainer = document.getElementById("messageContainer");


// =========================
// CURRENT USER
// =========================

const params = new URLSearchParams(window.location.search);
const username = params.get("user");

console.log("Current User:", username);

const users = {
    allan: "6ab8632c141bedf59cf879a4",
    cynthia: "6ab863c70f18b59181780693"
};

const currentUser = users[username];

console.log("Current User ID:", currentUser);


// =========================
// CONVERSATION
// =========================

const conversationId = "6ab8671fbef8793003ed3e53";


// =========================
// DISPLAY MESSAGE
// =========================

const displayMessage = (message) => {

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");


    // Determine which side the message belongs to

    if (message.sender === currentUser) {
        messageElement.classList.add("outgoing");
    } else {
        messageElement.classList.add("incoming");
    }


    // Message text

    const messageText = document.createElement("p");

    messageText.textContent = message.content;


    // Add message text to bubble

    messageElement.appendChild(messageText);


    // Add bubble to chat

    messageContainer.appendChild(messageElement);


    // Automatically scroll to latest message

    messageContainer.scrollTop = messageContainer.scrollHeight;
};


// =========================
// LOAD OLD MESSAGES
// =========================

const loadMessages = async () => {

    try {

        const response = await fetch(
            `http://localhost:8000/api/messages/${conversationId}`
        );

        const data = await response.json();

        console.log("Messages:", data.message);


        data.message.forEach((message) => {

            displayMessage(message);

        });

    } catch (error) {

        console.error("Error loading messages:", error);

    }
};


// =========================
// SEND MESSAGE
// =========================

sendButton.addEventListener("click", () => {

    const content = messageInput.value.trim();


    // Don't send empty messages

    if (!content) {
        return;
    }


    socket.emit("send_message", {

        conversation: conversationId,

        sender: currentUser,

        content: content

    });


    // Clear input

    messageInput.value = "";

    // Put cursor back into input

    messageInput.focus();

});


// =========================
// RECEIVE NEW MESSAGE
// =========================

socket.on("message_received", (message) => {

    console.log("Received:", message);

    displayMessage(message);

});

socket.emit("join_conversation", conversationId);

loadMessages();