const fs = require('fs');
const https = require('https');
const exec = require('child_process').exec;
const readline = require('readline');
const isWindows = process.platform == 'win32';

function log(){
var date = new Date();
console.log([date.getHours(), date.getMinutes(), date.getSeconds()].map(v=>{return v<10 ? '0'+v : v}).join(':'), ...arguments);
}

function error(s){
log(s);
process.exit(1);
}

function writeFile(path, data){
try{
fs.writeFileSync(path, data);
return true;
}catch(e){
}
return false;
}

async function sleep(v){
return new Promise(resolve=>setTimeout(resolve,v));
}

async function prompt(msg){
var rl = readline.createInterface({input:process.stdin, output:process.stdout});
return new Promise(resolve=>{
rl.question(msg+' ',res=>{
rl.close();
resolve(res);
});
});
}

async function openURL(url){
var pl = process.platform;
var start = (pl=='darwin' ? 'open' : pl=='win32' ? 'start' : 'xdg-open');
if(pl=='win32')url = url.split('&').join('^&');
else url = '"'+url+'"';
return execSync(start+' '+url);
}

function downloadFile(url){
return new Promise(resolve=>{
var chunks = [];
var isErrors = false;
var result = {status:0};
var client = https.get(url, res=>{
result.status = res.statusCode;
res.on('data', chunk=>chunks.push(chunk));
});

client.on('error', e=>{
if(!isErrors){
isErrors = true;
resolve(result);
}
});

client.on('close', ()=>{
if(isErrors)return;
result.data = Buffer.concat(chunks);
resolve(result);
});

client.end();
});
}

async function execSync(s, isTest){
return new Promise((resolve, reject)=>{
exec(s,(error, stdout, stderr)=>{
if(error){
resolve(false);
return;
}
if(!isTest && stdout)log(stdout);
resolve(true);
});
});
}

async function run(){
var url = 'https://codeload.github.com/animalsgame/chat-bot/zip/refs/heads/main';
var libFileName = 'jszip.min.js';
var filename = 'main.zip';
var mainFolderZip = 'chat-bot-main';
var nodeFilePath = mainFolderZip+'/node.exe';
var tokenFile = mainFolderZip+'/token.txt';

log('Вас приветствует мастер установки');

if(fs.existsSync(mainFolderZip)){
error('У вас уже установлен бот, вам нужно удалить папку '+mainFolderZip+'\nЭто защита чтобы не потеряли свой код в app.js');
return;
}

var cb1 = async()=>{

if(isWindows && !fs.existsSync(nodeFilePath)){
log('Копирование node.exe в папку с ботом');
try{
fs.writeFileSync(nodeFilePath, fs.readFileSync('node.exe'));
log('Копирование завершено');
}catch(e){
log('Не удалось скопировать node.exe');
}
}

log('Распаковка zip архива завершена');
log('Нажмите клавишу Enter чтобы открыть папку с ботом\nи откроется файл token.txt, вам останется только вставить токен бота!');
log('Не забудьте сохранить файл в блокноте, например через CTRL + S');
await prompt('');
await openURL(mainFolderZip);
if(!fs.existsSync(tokenFile))writeFile(tokenFile, 'token');
await sleep(200);
await openURL(tokenFile);
//fs.unlinkSync(filename);

log('Запустите бота через файл run');
error('Установка завершена!');
};

var cbUnzip = async()=>{
var zipLib = null;
try{
zipLib = require('./'+libFileName);
}catch(e){
error('Библиотека для работы с zip архивом не загружена');
}

if(zipLib){
log('Идёт чтение zip архива');
try{
var zip = await zipLib.loadAsync(fs.readFileSync(filename));
var files = Object.keys(zip.files);
//console.log(zip.files);
log('Идёт распаковка zip архива');
for (var i = 0; i < files.length; i++) {
var el = zip.files[files[i]];
if(el.dir){
var folderPath = el.name;
if(folderPath[folderPath.length-1] == '/')folderPath=folderPath.substr(0, folderPath.length-1);
log('Создание папки', folderPath);
try{
fs.mkdirSync(folderPath);
}catch(e){
log('Не удалось создать папку', folderPath);
}
//console.log('folder',el.name);
}else{
log('Извлечение файла',el.name);
var content = await el.async('nodebuffer');
if(content)fs.writeFileSync(el.name, content);
}
}

if(!isWindows && fs.existsSync(nodeFilePath))fs.unlinkSync(nodeFilePath);

if(fs.existsSync(filename)){
cb1();
}else{
error('Не удалось распаковать zip архив полностью, запустите установку ещё раз.');
}

}catch(e){
error('Не удалось прочитать zip архив, запустите установку ещё раз.');
}
}
}



//cbUnzip();
//return;

log('Идёт скачивание проекта, нужно подождать');

if(fs.existsSync(filename))fs.unlinkSync(filename);

var result = await downloadFile(url);
if(result && result.status == 200 && result.data && result.data.length > 2 && result.data[0] == 0x50 && result.data[1] == 0x4B){
var res = writeFile(filename, result.data);
if(res){
cbUnzip();
}else{
error('Не удалось сохранить zip архив, попробуйте ещё раз.');
}
}else{
error('Не удалось скачать проект, попробуйте ещё раз.');
}
}

run();