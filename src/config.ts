import { config } from "dotenv";

config();

const env = {
  TOKEN: process.env.TOKEN,
  PREFIX: process.env.PREFIX,
  PORT: process.env.PORT,
};

export default env;
