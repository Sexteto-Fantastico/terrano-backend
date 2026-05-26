export function parseBooleanQuery(value: any): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  const strValue = String(value).toLowerCase();
  if (strValue === "false" || strValue === "0") {
    return false;
  }
  return true;
}
