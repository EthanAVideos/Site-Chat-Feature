<?php
require 'Configuration/auth.php'; // ensures user is logged in
?>

<!DOCTYPE html>
    <html>
        <head>
            <title>Chats</title>
            <link rel="stylesheet" href="Configuration/styles/scf.css">
        </head>
        <body>
            <center>
                <div id="chats">
                    <div id="chats-nav">
                        <img class="chat-btn" data-chat="General" src="Configuration/Graphics/gDot.svg" title="General Chat"/>
                        <img class="chat-btn" data-chat="Recording" src="Configuration/Graphics/rDot.svg" title="Recorders Chat"/>
                        <img class="chat-btn" data-chat="Modders" src="Configuration/Graphics/mDot.svg" title="Modders Chat"/>
                        <img class="chat-btn" data-chat="Admin" src="Configuration/Graphics/aDot.svg" title="Admin Chat"/>
                    </div>
                    <div id="chat">
                        <h3 id="activechat">General Chat</h3>
                        <div id="messages"></div> <!-- messages loaded here -->
                        <button id="jumpBottom" type="button">↓ Latest</button>
                    </div>
                    <form id="msgForm">
                    <div id="messaging">
                    <textarea id="msgBox" type="text" placeholder="Type Message" required title=""></textarea><button type="button" id="emojiBtn" title="Emoji Picker">😀</button><div id="emojiPicker" class="emoji-picker"></div><button id="sendMsg" type="submit" title="Send Message">SEND</button>
                    </div>
                        <div id="msgPreview"></div>
                    </form>
                </div>
            </center>
        </body>
        <script src="Configuration/javascript/scf/UI.js" type="text/javascript"></script>
    </html>
