import { existsSync, readFileSync, writeFileSync } from "fs";
import env from "./config";

if (!existsSync(env.DATA)) writeFileSync(env.DATA, "[]");

export const savelist = async (words: string[]): Promise<void> => {
  writeFileSync(env.DATA, JSON.stringify(words));
};

export const getlist = async (): Promise<string[] | undefined> => {
  return JSON.parse(readFileSync(env.DATA, { encoding: "utf-8" }));
};

export const add = async (word: string[]): Promise<boolean> => {
  let words = await getlist();
  if (!words) return false;

  words.push(...word);
  await savelist(words);
  return true;
};

export const remove = async (word: string[]): Promise<boolean> => {
  let words = await getlist();
  if (!words) return false;

  words = words.filter((value) => {
    return !word.includes(value);
  });

  await savelist(words);

  return true;
};
