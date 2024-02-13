const redis = require('redis');

(async () => {
    // Create a Redis client
    const subscriber = redis.createClient({
        url: 'redis://127.0.0.1:6379'
    });

    await subscriber.connect()

    // Subscribe to a channel
    const channel = 'pm2-logs';
    const listener = (message, channel) => console.log(message);
    await subscriber.subscribe(channel, listener);

})()

// Keep the Node.js process running indefinitely
new Promise(() => { });
