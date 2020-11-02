import { exec } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import env from "./config";

if (!existsSync(env.DATA)) {
  writeFileSync(env.DATA, "[]");
}

export const savelist = async (words: string[]): Promise<void> => {
  writeFileSync(env.DATA, JSON.stringify(words));
};

export const getlist = async (): Promise<string[] | undefined> => {
  return JSON.parse(readFileSync(env.DATA, { encoding: "utf-8" }));
};

export const add = async (word: string): Promise<boolean> => addlist([word]);

export const addlist = async (word: string[]): Promise<boolean> => {
  let words = await getlist();
  if (!words) return false;

  words.push(...word);
  await savelist(words);
  return true;
};

export const remove = async (word: string): Promise<boolean> => {
  let words = await getlist();
  if (!words) return false;

  let include = false;

  words = words.filter((value) => {
    if (word == value) {
      include = true;
      return false;
    }
    return true;
  });

  await savelist(words);

  return include;
};
