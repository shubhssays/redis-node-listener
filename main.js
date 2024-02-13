// This code starts the nodejs app inside container.

const { exec } = require('child_process');
const { initRedis, publishToChannel } = require("./dbConfig/redisConnect"); // I have created my own separate redis class to connect to redis. PLEASE WRITE YOUR OWN 😂
const channelName = "pm2-logs";

async function init() {
    console.log("executing docker.js");

    const newProcess = exec(`npm install && npm run migrate:up && npm install pm2 -g &&  pm2-runtime start app.js`)
    await initRedis(); // intializing redis so that it can get connected to redis server
    newProcess.stdout.on('data', function (data) {
        console.log(data.toString())
        publishToChannel(channelName, data.toString())
    })

    newProcess.stdout.on('error', function (data) {
        console.log(`Error: ${data.toString()}`)
        publishToChannel(channelName, `Error: ${data.toString()}`)
    })

    newProcess.on('close', function () {
        console.log('PM2 STOPPED')
        publishToChannel(channelName, 'PM2 STOPPED')
    })
}

init();
