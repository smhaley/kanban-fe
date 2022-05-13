export const getDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString(
      "en-US"
    )}`;
  };