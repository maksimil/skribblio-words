import { Client, Message, MessageEmbed } from "discord.js";
import { add, remove, getlist } from "./data";
import env from "./config";
import { readFileSync } from "fs";
import { jlistencode, jlistparse } from "./jlist";

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
      `${help.command}${help.args.reduce(
        (acc, curr) => `${acc} <${curr}>`,
        ""
      )}`,
      help.desc
    );
  else helpembed.addField(help.command, help.desc);
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
    msg.channel.send(`Set prefix to ${prefix}`);
  },

  add: async (msg) => {
    const words = jlistparse(getargsstring(msg));
    const success = await add(words);
    if (success) {
      msg.channel.send(`Successfully added ${jlistencode(words)}`);
    } else {
      msg.channel.send(`Failed to add ${jlistencode(words)}`);
    }
  },

  remove: async (msg) => {
    const words = jlistparse(getargsstring(msg));
    const success = await remove(words);
    if (success) {
      msg.channel.send(`Successfully removed ${jlistencode(words)}`);
    } else {
      msg.channel.send(`Failed to remove ${jlistencode(words)}`);
    }
  },

  list: async (msg) => {
    let words = await getlist();
    if (!words) {
      msg.channel.send("Failed to get list");
      return;
    }

    if (words.length > 0) {
      msg.channel.send(jlistencode(words));
    } else {
      msg.channel.send("There are no words");
    }
  },

  export: async (msg) => {
    msg.channel.send({ files: [env.DATA] });
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
