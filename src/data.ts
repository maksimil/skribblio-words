export const add = async (word: string): Promise<boolean> => {
  console.log(`Add ${word}`);
  return true;
};

export const list = async (): Promise<string[] | undefined> => {
  return ["words"];
};

export const remove = async (word: string): Promise<boolean> => {
  console.log(`Remove ${word}`);
  return true;
};
