const ffmpeg = require('ffmpeg-static');
const Discord = require('discord.js');
const client = new Discord.Client();

// Replace TOKEN with your bot's token
client.login('TOKEN');

// Set up an array for storing the music queue
const queue = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Split the message into individual words
  const args = message.content.split(/ +/);
  // Get the command from the first word of the message
  const command = args.shift().toLowerCase();

  // Check if the command is 'play'
  if (command === 'play') {
    // Get the song URL from the arguments
    const songURL = args[0];

    // Make sure a song URL was provided
    if (!songURL) {
      return message.reply('You must provide a song URL to play!');
    }

    // Add the song to the queue
    queue.push(songURL);

    // If the bot is not currently playing a song, start playing the song
    if (!client.voice.connections.size) {
      playSong(message);
    } else {
      message.channel.send(`Added ${songURL} to the queue!`);
    }
  }

  // Check if the command is 'skip'
  if (command === 'skip') {
    // End the current song and start the next one in the queue
    client.voice.connections.forEach(connection => {
      connection.disconnect();
    });
  }
});

// Define a function for playing a song
const playSong = message => {
  // Get the first song in the queue
  const songURL =
