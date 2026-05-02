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

// list password strengthen status
const PASSWORD_STRENGTH_LABELS = [
   "",
   "Weak",
   "Fair",
   "Good",
   "Strong",
] as const;

//List Password Strength Colour
const PASSWORD_STRENGTH_COLORS = [
   "",
   "#ef4444",
   "#f97316",
   "#eab308",
   "#22c55e",
] as const;

export const getPasswordStrengthLabel = (
   score: number
): string => {
   return PASSWORD_STRENGTH_LABELS[score] || "";
};

export const getPasswordStrengthColor = (
   score: number
): string => {
   return PASSWORD_STRENGTH_COLORS[score] || "";
};