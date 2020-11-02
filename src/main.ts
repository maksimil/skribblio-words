import { c_token, c_prefix } from "./config";
import { Client, Message } from "discord.js";
import { add, remove, list } from "./data";

let token = c_token;
let prefix = c_prefix;

const client = new Client();

const commands: { [key: string]: (msg: Message) => Promise<void> } = {
  help: async (msg) => {
    console.log("Help");
    msg.reply("Ass");
  },

  prefix: async (msg) => {
    prefix = msg.content.split(" ")[1];
    console.log(`Set prefix to ${prefix}`);
    msg.channel.send(`Set prefix to ${prefix}`);
  },

  add: async (msg) => {
    let word = msg.content.split(" ")[1];
    const success = await add(word);
    if (success) {
      msg.channel.send(`Successfully added ${word}`);
    } else {
      msg.channel.send(`Failed to add ${word}`);
    }
  },

  remove: async (msg) => {
    let word = msg.content.split(" ")[1];
    const success = await remove(word);
    if (success) {
      msg.channel.send(`Successfully removed ${word}`);
    } else {
      msg.channel.send(`Failed to remove ${word}`);
    }
  },

  list: async (msg) => {
    let words = await list();
    if (!words) {
      msg.channel.send("Failed to get list");
      return;
    }
    let wordsstring = "";
    words.forEach((word) => {
      wordsstring += ` - ${word}\n`;
    });
    msg.channel.send(`Words:\n${wordsstring}`);
  },
};

client.on("message", (msg) => {
  if (msg.author === client.user) return;

  if (msg.content.startsWith(prefix)) {
    const command = msg.content.split(" ")[0].slice(prefix.length);
    const fun = commands[command];

    if (!fun) {
      msg.channel.send(`Command ${command} not found`);
      return;
    }

    fun(msg);
  }
});

client.login(token).then(console.log);
