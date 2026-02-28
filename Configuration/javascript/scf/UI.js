const emojiMap = {
    smile:"😄", grin:"😁", joy:"😂", rofl:"🤣", wink:"😉",
    heart:"❤️", broken_heart:"💔", thumbs_up:"👍", thumbs_down:"👎",
    clap:"👏", fire:"🔥", star:"⭐", sparkles:"✨",
    thinking:"🤔", scream:"😱", cry:"😢", sob:"😭",
    angry:"😠", rage:"😡", cool:"😎", sunglasses:"🕶️",
    kiss:"😘", blush:"😊", sleepy:"😴", poop:"💩",
    wave:"👋", ok_hand:"👌", muscle:"💪",
    pray:"🙏", eyes:"👀", brain:"🧠",
    rocket:"🚀", crown:"👑", trophy:"🏆",
    check:"✔️", cross:"❌", warning:"⚠️",
    coffee:"☕", pizza:"🍕", burger:"🍔",
    beer:"🍺", cake:"🎂", gift:"🎁",
    music:"🎵", headphone:"🎧",
    phone:"📱", laptop:"💻",
    sun:"☀️", moon:"🌙",
    snowflake:"❄️", cloud:"☁️",
    dog:"🐶", cat:"🐱"
};

const messagesDiv = document.getElementById('messages');
const activeChatH3 = document.getElementById('activechat');
const msgForm = document.getElementById('msgForm');
const msgInput = document.getElementById('msgBox');
const msgPreview = document.getElementById('msgPreview');
const jumpBtn = document.getElementById('jumpBottom');

let currentChat = 'General';
let lastMessageCount = 0; // track messages to avoid duplicates

function escapeHTML(text) {
    return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------- FORMAT MESSAGE FUNCTION ----------
function formatMessage(text) {

    text = escapeHTML(text);   // sanitize first
    text = replaceEmojis(text);

    return text
    .replace(/\[link\](.*?)\[\/link\]/gi, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\[h1\](.*?)\[\/h1\]/gi, '<h1>$1</h1>')
    .replace(/\[h2\](.*?)\[\/h2\]/gi, '<h2>$1</h2>')
    .replace(/\[h3\](.*?)\[\/h3\]/gi, '<h3>$1</h3>')
    .replace(/\[h4\](.*?)\[\/h4\]/gi, '<h4>$1</h4>')
    .replace(/\[h5\](.*?)\[\/h5\]/gi, '<h5>$1</h5>')
    .replace(/\[h6\](.*?)\[\/h6\]/gi, '<h6>$1</h6>')
    .replace(/\[small\](.*?)\[\/small\]/gi, '<small>$1</small>')
    .replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>')
    .replace(/\[mark\](.*?)\[\/mark\]/gi, '<mark>$1</mark>')
    .replace(/\[uline\](.*?)\[\/uline\]/gi, '<u>$1</u>')
    .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');
}

// ---------- LOAD MESSAGES ----------
function loadMessages(chatName) {
    currentChat = chatName;
    activeChatH3.textContent = chatName + " Chat";

    fetch(`api.php?action=loadChat&chat=${chatName}`)
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data)) data = [];
        messagesDiv.innerHTML = '';
        data.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg';
            msgDiv.innerHTML = `<p><b class="name">${msg.user}</b> <small class="timestamp">${msg.timeStamp}</small></p>
            <hr>
            <p class="message">${formatMessage(msg.message)}</p>`;
            messagesDiv.appendChild(msgDiv);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        lastMessageCount = data.length;
    });
}

// ---------- POLLING FOR NEW MESSAGES ----------
function pollMessages() {
    fetch(`api.php?action=loadChat&chat=${currentChat}`)
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data)) return;

        // Only append truly new messages
        if (data.length > lastMessageCount) {
            const newMessages = data.slice(lastMessageCount);
            newMessages.forEach(msg => {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'msg';
                msgDiv.innerHTML = `<p><b class="name">${msg.user}</b> <small class="timestamp">${msg.timeStamp}</small></p>
                <hr>
                <p class="message">${formatMessage(msg.message)}</p>`;
                messagesDiv.appendChild(msgDiv);
            });

            // Auto-scroll only if near bottom
            if (messagesDiv.scrollHeight - messagesDiv.scrollTop <= messagesDiv.clientHeight + 50) {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
            lastMessageCount = data.length;
        }
    })
    .catch(err => console.error('Polling error:', err));
}
setInterval(pollMessages, 3000); // Poll every 3 seconds

// ---------- SEND MESSAGE ----------
msgForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const msg = msgInput.value.trim();
    if (!msg) return;

    fetch("api.php?action=sendChat", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `chat=${encodeURIComponent(currentChat)}&message=${encodeURIComponent(msg)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg';
            msgDiv.innerHTML = `<p><b class="name">${data.user}</b> <small class="timestamp">${data.timeStamp}</small></p>
            <hr>
            <p class="message">${formatMessage(msg)}</p>`;
            messagesDiv.appendChild(msgDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Clear input and preview
            msgInput.value = '';
            msgPreview.innerHTML = '';

            // Update lastMessageCount so polling doesn't duplicate
            lastMessageCount++;
        }
    });
});

function replaceEmojis(text) { // Emojio Replacement
    return text.replace(/:([a-z0-9_+-]+):/gi, (match, p1) => {
        return emojiMap[p1.toLowerCase()] || match;
    });
}

const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");

emojiBtn.addEventListener("click", () => {
    emojiPicker.style.display =
    emojiPicker.style.display === "block" ? "none" : "block";
});

// Build picker
for (const [name, emoji] of Object.entries(emojiMap)) {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.title = ":" + name + ":";
    span.addEventListener("click", () => {
        insertAtCursor(msgInput, ":" + name + ":");
        emojiPicker.style.display = "none";
        msgInput.dispatchEvent(new Event("input"));
    });
    emojiPicker.appendChild(span);
}

function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value =
    textarea.value.substring(0, start) +
    text +
    textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
}

// ---------- LIVE PREVIEW ----------
msgInput.addEventListener("input", () => {
    msgPreview.innerHTML = formatMessage(msgInput.value);
});

// ---------- ENTER / SHIFT+ENTER ----------
msgInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        msgForm.requestSubmit();
    }
});

const autoBox = document.createElement("div");
autoBox.className = "emoji-picker";
autoBox.style.position = "absolute";
document.body.appendChild(autoBox);

msgInput.addEventListener("input", function () {
    const cursorPos = this.selectionStart;
    const textBefore = this.value.substring(0, cursorPos);
    const match = textBefore.match(/:([a-z0-9_+-]{1,20})$/i);

    autoBox.innerHTML = "";

    if (match) {
        const search = match[1].toLowerCase();
        const matches = Object.keys(emojiMap)
        .filter(name => name.includes(search))
        .slice(0, 5);

        if (matches.length) {
            autoBox.style.display = "block";
            autoBox.style.left = this.offsetLeft + "px";
            autoBox.style.top = (this.offsetTop - 60) + "px";

            matches.forEach(name => {
                const div = document.createElement("div");
                div.textContent = emojiMap[name] + " :" + name + ":";
                div.style.cursor = "pointer";
                div.addEventListener("click", () => {
                    this.value =
                    this.value.substring(0, cursorPos - search.length - 1) +
                    ":" + name + ":" +
                    this.value.substring(cursorPos);
                    this.dispatchEvent(new Event("input"));
                    autoBox.style.display = "none";
                });
                autoBox.appendChild(div);
            });
        } else {
            autoBox.style.display = "none";
        }
    } else {
        autoBox.style.display = "none";
    }
});

// ---------- CHAT NAV BUTTONS ----------
document.querySelectorAll('.chat-btn').forEach(btn => {
    btn.addEventListener('click', () => loadMessages(btn.dataset.chat));
});

// ---------- JUMP TO LATEST ----------
function scrollToBottom() {
    messagesDiv.scrollTo({
        top: messagesDiv.scrollHeight,
        behavior: "smooth"
    });
}

function updateJumpButton() {
    const isScrollable = messagesDiv.scrollHeight > messagesDiv.clientHeight;
    if (!isScrollable) {
        jumpBtn.style.display = "none";
        return;
    }
    const nearBottom = messagesDiv.scrollHeight - messagesDiv.scrollTop <= messagesDiv.clientHeight + 50;
    jumpBtn.style.display = nearBottom ? "none" : "block";
}

jumpBtn.addEventListener("click", scrollToBottom);
messagesDiv.addEventListener("scroll", updateJumpButton);
window.addEventListener("load", updateJumpButton);

// ---------- INITIAL LOAD ----------
loadMessages(currentChat);
