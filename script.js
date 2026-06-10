// --- Dark Mode Persistence ---
const themeBtn = document.getElementById('themeBtn');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️ Light Mode';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeBtn.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeBtn.textContent = '🌙 Dark Mode';
    }
});

// --- Contact Form Submission & LocalStorage Handling ---
const contactForm = document.getElementById('contactForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = emailInput.value.trim();
    const message = document.getElementById('message').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        return;
    } else {
        emailError.textContent = '';
    }
    
    const newMessage = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString()
    };
    
    let existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    existingMessages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
    
    alert('Message submitted successfully!');
    contactForm.reset();

    // If admin is currently logged in, refresh the panel live
    if (!adminDashboard.classList.contains('hidden')) {
        renderMessages();
    }
});

// --- Admin Authentication & Dashboard Logic ---
const loginBox = document.getElementById('loginBox');
const adminDashboard = document.getElementById('adminDashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const messagesContainer = document.getElementById('messagesContainer');
const loginError = document.getElementById('loginError');

const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

loginBtn.addEventListener('click', () => {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        loginBox.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loginError.textContent = "";
        renderMessages();
    } else {
        loginError.textContent = "Invalid username or password!";
    }
});

logoutBtn.addEventListener('click', () => {
    adminDashboard.classList.add('hidden');
    loginBox.classList.remove('hidden');
    document.getElementById('adminUser').value = "";
    document.getElementById('adminPass').value = "";
});

function renderMessages() {
    messagesContainer.innerHTML = "";
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = "<p>No messages submitted yet.</p>";
        return;
    }
    
    // Reverse array to show the most recent submission on top
    messages.reverse().forEach(msg => {
        const messageCard = document.createElement('div');
        messageCard.className = 'card';
        messageCard.style.borderLeft = '4px solid #ff9800';
        messageCard.innerHTML = `
            <p><strong>Date:</strong> ${msg.timestamp}</p>
            <p><strong>Name:</strong> ${msg.name}</p>
            <p><strong>Email:</strong> ${msg.email}</p>
            <p><strong>Message:</strong> ${msg.message}</p>
        `;
        messagesContainer.appendChild(messageCard);
    });
}