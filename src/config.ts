import { config } from "dotenv";

config();

const env = {
  TOKEN: process.env.TOKEN,
  PREFIX: process.env.PREFIX,
};

export default env;
