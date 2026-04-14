import messages from '../message/en.json';

export function t(
  key: string,
  variables?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = messages;

  for (const k of keys) {
    value = value?.[k];
  }

  if (!value) return key;

  // 👇 handle variables like {name}
  if (variables) {
    Object.keys(variables).forEach((varKey) => {
      value = value.replace(`{${varKey}}`, String(variables[varKey]));
    });
  }

  return value;
}