import { config } from "dotenv";
import { exit } from "process";

config();

const vars = ["TOKEN", "PREFIX", "PORT", "DATA"];
let allexist = true;
vars.forEach((name) => {
  if (!process.env[name]) {
    console.log(`${name} is not specified`);
    allexist = false;
  }
});

if (!allexist) exit(1);

const env = {
  TOKEN: process.env.TOKEN as string,
  PREFIX: process.env.PREFIX as string,
  PORT: process.env.PORT as string,
  DATA: process.env.DATA as string,
};

export default env;
