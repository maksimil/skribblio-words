import { Client, Message, MessageEmbed } from "discord.js";
import { add, remove, getlist, addlist } from "./data";
import env from "./config";
import express from "express";
import { readFileSync } from "fs";

// bot
let prefix = env.PREFIX as string;

const helpobject: {
  command: string;
  args: string[];
  desc: string;
}[] = JSON.parse(readFileSync("./assets/HELP.json", { encoding: "utf-8" }));

let helpembed: MessageEmbed = new MessageEmbed();
helpobject.forEach((help) => {
  if (help.args.length > 0)
    helpembed.addField(
      `${prefix}${help.command}${help.args.reduce(
        (acc, curr) => `${acc} <${curr}>`,
        ""
      )}`,
      help.desc
    );
  else helpembed.addField(`${prefix}${help.command}`, help.desc);
});

const getargsstring = (msg: Message) => {
  let regres = msg.content.match(/ (.*)/);
  if (!regres) return "";
  else return regres[1];
};

const client = new Client();

const commands: { [key: string]: (msg: Message) => Promise<void> } = {
  help: async (msg) => {
    msg.channel.send(helpembed);
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

    if (words.length > 0) {
      let wordsstring = "";
      words.forEach((word) => {
        wordsstring += `${word}, `;
      });
      msg.channel.send(wordsstring);
    } else {
      msg.channel.send("There are no words");
    }
  },

  export: async (msg) => {
    msg.channel.send({ files: [env.DATA] });
  },

  import: async (msg) => {
    let wordslist = getargsstring(msg);
    let words = JSON.parse(wordslist);

    const success = await addlist(words);
    if (success) {
      msg.channel.send(`Successfully imported words`);
    } else {
      msg.channel.send(`Failed to import words`);
    }
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
