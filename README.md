# Быстрая установка чат-бота!

Проект с чат-ботом находится по ссылке https://github.com/animalsgame/chat-bot

### Этот установщик поможет быстро запустить чат-бота, вам понадобится только токен бота.

# Windows
### 1: Скачайте архив с проектом, можно по прямой ссылке
https://github.com/animalsgame/chat-bot-installer/archive/refs/heads/main.zip

Откройте архив, перенесите папку `chat-bot-installer-main` из архива в любое удобное место, например на рабочий стол, откройте эту папку.
### 2: Запустите файл install

# Linux (через терминал)
### 1: Установите nodejs, unzip, curl (если этих программ нет)
nodejs - для запуска js `apt-get install nodejs`  
unzip - для распаковки zip архива `apt-get install unzip`  
curl - для загрузки файла `apt-get install curl`

### 2: Запустить установку (с быстрым запуском бота)
В конце команды есть текст `BOT_TOKEN` замените этот текст на ваш токен, токен будет записан в файл и бот сможет запускаться одной командой!  
После установки появится папка `chat-bot-main` это и есть бот
```
curl -o chatBotM.zip https://codeload.github.com/animalsgame/chat-bot/zip/refs/heads/main && unzip -o chatBotM.zip && rm chatBotM.zip && cd chat-bot-main && node service.js token=BOT_TOKEN
```
#### Для повторного запуска бота просто ввести команду `node service.js` (из папки с ботом)

# Через игровой центр vm2
Откройте игру Побег собачек в игровом центре, перейдите к своему боту, затем в управление, рядом с кнопкой "токен доступа" будет кнопка `установить бота` установка в один клик!
