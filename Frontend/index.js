//const socket = io("http://localhost:8000");
let hasToken = false
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const loginData = { username, password };

  try {
    const response = await fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.user.token
      localStorage.setItem("token", data.user.token);
      console.log("Login Response:", data);
      const chatArea = document.getElementById("chatArea")
      const authSection = document.getElementById("authSection")
      chatArea.style.display = "block"
      authSection.style.display = "none"
      //const token =
       //localStorage.getItem("token");
      initializeSocket(token);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
});

function initializeSocket(token) {
  
  const socket = io("http://localhost:8000", {
    auth: {
    token: token,
  },
});


const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
//const currentUser="6ab8632c141bedf59cf879a4"
const receiverTitle = document.getElementById("receiverTitle");

const params = new URLSearchParams(window.location.search);
const username = params.get("user");

console.log("Current User:", username);
const users = {
  allan: "6ac15e9a539d1bcbf816b750", //"6ab8632c141bedf59cf879a4",
  cynthia: "6ac1842e90cba76bb346222c",
};

const currentUser = users[username];

const displayMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (message.sender === currentUser) {
    
    messageElement.classList.add("outgoing");
  } else {
    messageElement.classList.add("incoming");
    receiverTitle.textContent =
      message.sender === users.allan ? "Allan" : "Cynthia";
  }

  const messageText = document.createElement("p");
  const time = document.createElement("span");
  time.classList.add("message-time");
  time.textContent = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageText.textContent = message.content;
  messageElement.appendChild(messageText);
  messageElement.appendChild(time);

  const container = document.getElementById("messageContainer");
  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight;
};

const loadMessages = async () => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/messages/6ac18946bbf228f944f79ec4`, //6ab8671fbef8793003ed3e53`,
     {
      headers:{
        "Authorization": `Bearer ${token}`
      }
      
     }
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

sendButton.addEventListener("click", () => {
  socket.emit("send_message", {
    conversation: "6ac18946bbf228f944f79ec4",
    sender: currentUser,
    content: messageInput.value,
  });
  messageInput.value = "";
  messageInput.focus();
});

socket.on("message_received", (message) => {
  displayMessage(message);
});

socket.emit("join_conversation", "6ac18946bbf228f944f79ec4"); // "6ab8671fbef8793003ed3e53");

loadMessages();


}
