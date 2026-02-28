# Site-Chat-Feature
Site Chat Feature (SCF) is a PHP, HTML, JS, and JSON project that can be customized and dropped into a site to offer chatting without a database.

# General About
By default, it supports up to 12 different formatting tags for messaging and has 50 emojis built into the system, and an emoji picker.

## Formatting
For text to be formatted, you must place an opening and ending tag around the text, for example, [h1]Header 1[/h1].
Brackets must be []. (The following won't work {}, (), <>)
Supported tags:
h1 to h6, small, b, uline, mark, & link.

You can type emojis as well. The emoji name must be inside two colons "::". Or use the built-in emoji picker, additionally, while having the emoji picker window open and hovering over emojis will show the command to type them. Example ``` :wave: ``` would give 👋.

## Helpful Note
As of build 1 (0.0.1), there is no light theme CSS file, only dark, which is included, and therefore, if you want a light theme, you will have to style it yourself before implementing in your site.
You will need the EAV Site Security System (SSS) 1.3.1 build 4 or later, as it uses the auth.php to pull the logged-in user's username when they are sending messages.


SCF 0.0.1 Build 1, 2026. #001122826.
