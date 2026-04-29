export const getPasswordStrengthScore = (
  password: string
): number => {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

export const getPasswordStrengthLabel = (
  score: number
): string => {
  return ["", "Weak", "Fair", "Good", "Strong"][score];
};

export const getPasswordStrengthColor = (
  score: number
): string => {
  return [
    "",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
  ][score];
};
