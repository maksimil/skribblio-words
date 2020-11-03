import { existsSync, readFileSync, writeFileSync } from "fs";
import env from "./config";
import { jlistencode, jlistparse } from "./jlist";

if (!existsSync(env.DATA)) {
  writeFileSync(env.DATA, "");
}

export const savelist = async (words: string[]): Promise<void> => {
  writeFileSync(env.DATA, jlistencode(words));
};

export const getlist = async (): Promise<string[] | undefined> => {
  return jlistparse(readFileSync(env.DATA, { encoding: "utf-8" }));
};

export const add = async (words: string[]): Promise<boolean> => {
  let listwords = await getlist();
  if (!listwords) return false;

  listwords.push(...words);
  await savelist(listwords);
  return true;
};

export const remove = async (words: string[]): Promise<boolean> => {
  let listwords = await getlist();
  if (!listwords) return false;

  listwords = listwords.filter((value) => !words.includes(value));

  await savelist(listwords);

  return true;
};
