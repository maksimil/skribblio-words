import { Client, Message } from "discord.js";
import { exit } from "process";
import { add, remove, getlist } from "./data";
import env from "./config";
import express from "express";

// bot
let prefix = env.PREFIX as string;

const getargsstring = (msg: Message) => {
  let regres = msg.content.match(/ (.*)/);
  if (!regres) return "";
  else return regres[1];
};

const client = new Client();

const commands: { [key: string]: (msg: Message) => Promise<void> } = {
  help: async (msg) => {
    msg.reply("Ass");
  },

  prefix: async (msg) => {
    prefix = msg.content.split(" ")[1];
    console.log(`Set prefix to ${prefix}`);
    msg.channel.send(`Set prefix to ${prefix}`);
  },

  add: async (msg) => {
    let word = getargsstring(msg);
    const success = await add(word);
    if (success) {
      msg.channel.send(`Successfully added ${word}`);
    } else {
      msg.channel.send(`Failed to add ${word}`);
    }
  },

  remove: async (msg) => {
    let word = getargsstring(msg);
    const success = await remove(word);
    if (success) {
      msg.channel.send(`Successfully removed ${word}`);
    } else {
      msg.channel.send(`Failed to remove ${word}`);
    }
  },

  list: async (msg) => {
    let words = await getlist();
    if (!words) {
      msg.channel.send("Failed to get list");
      return;
    }

    let wordsstring = "";
    words.forEach((word) => {
      wordsstring += `${word}, `;
    });
    msg.channel.send(`Words:\n${wordsstring}`);
  },

  export: async (msg) => {
    msg.channel.send("Words", { files: [env.DATA] });
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

client.login(env.TOKEN).then((token) => {
  console.log("Started");
});

// express list
const app = express();

app.get("/", async (req, res) => {
  let words = await getlist();
  if (!words) {
    res.send("failed");
    return;
  }

  let wordsstring = "";
  words.forEach((word) => {
    wordsstring += `${word}, `;
  });

  res.send(wordsstring);
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
