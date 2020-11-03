export const jlistencode = (data: string[]) =>
  data.length > 0
    ? data[0] +
      data.slice(1, data.length).reduce((acc, curr) => `${acc}, ${curr}`, "")
    : "";

export const jlistparse = (data: string) =>
  [...data.matchAll(/[ ]*([^,]+)[,]?/g)].map((e) => e[1]);
