type Options = {
  mode: "light" | "dark";
  theme: keyof typeof THEMES;
  h: number;
  w: number;
};

const GRAY = {
  light: "#ebedf0",
  dark: "#ebedf0",
} as const;

const THEMES = {
  github_green: {
    light: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
  },
  github_halloween: {
    light: ["#fdf156", "#ffc722", "#ff9711", "#04001b"],
    dark: ["#fdf156", "#ffc722", "#ff9711", "#04001b"],
  },
} as const;

export const pickColor = (
  contributions: number[],
  today: number,
  options: Options = {
    mode: "light",
    theme: "github_green",
    w: 1920,
    h: 1080,
  }
) => {
  if (today === 0) return GRAY[options.mode];

  const colorScheme = THEMES[options.theme][options.mode];
  const max = Math.max(...contributions);
  const index = Math.round((today / max) * 3);

  return colorScheme[index];
};
