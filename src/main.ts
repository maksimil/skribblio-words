import { Client, Message } from "discord.js";
import { exit } from "process";
import { add, remove, getlist } from "./data";
import env from "./config";
import express from "express";

// bot
let prefix = env.PREFIX as string;

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
    let words = msg.content.split(" ");
    words.splice(0, 1);
    const success = await add(words);
    if (success) {
      words.forEach((word) => {
        msg.channel.send(`Successfully added ${word}`);
      });
    } else {
      words.forEach((word) => {
        msg.channel.send(`Failed to add ${word}`);
      });
    }
  },

  remove: async (msg) => {
    let words = msg.content.split(" ");
    words.splice(0, 1);
    const success = await remove(words);
    if (success) {
      words.forEach((word) => {
        msg.channel.send(`Successfully removed ${word}`);
      });
    } else {
      words.forEach((word) => {
        msg.channel.send(`Failed to remove ${word}`);
      });
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
    wordsstring += ` - ${word}<br>`;
  });

  res.send(`Words:<br>${wordsstring}`);
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
