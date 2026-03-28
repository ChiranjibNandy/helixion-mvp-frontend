const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
] as const;


function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (str.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  return hash;
}


export function getAvatarColor(name: string): string {
  if (!name) return AVATAR_GRADIENTS[0];
  const index = Math.abs(hashStringToInt(name)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export function getInitials(name: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  return trimmed
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}


export function formatRegistrationDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[formatRegistrationDate] Received invalid date string: "${isoString}"`
      );
    }
    return "Unknown date";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
