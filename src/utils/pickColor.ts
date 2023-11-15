type Options = {
  mode: "light" | "dark";
  color: keyof typeof COLORS;
};

const GRAY = {
  light: "#ebedf0",
  dark: "#ebedf0",
} as const;

const COLORS = {
  github_green: {
    light: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
  },
} as const;


export const pickColor = (
  contributions: number[],
  today: number,
  options: Options = {
    mode: "light",
    color: "github_green",
  }
) => {
  const colorScheme = COLORS[options.color][options.mode];

  if (today === 0) return GRAY[options.mode];

  const max = Math.max(...contributions);
  const normalizedToday = Math.round((today / max) * 3);

  return colorScheme[normalizedToday];
};
