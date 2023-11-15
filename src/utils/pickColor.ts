const github_light = ["#9be9a8", "#40c463", "#30a14e", "#216e39"] as const;
const GRAY = "#ebedf0";

export const pickColor = (contributions: number[], today: number) => {
  const colorScheme = github_light;

  if (today === 0) return GRAY;

  const max = Math.max(...contributions);
  const normalizedToday = Math.round((today / max) * 3);

  return colorScheme[normalizedToday];
};
