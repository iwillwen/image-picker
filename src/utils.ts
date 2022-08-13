import qs from "query-string";

export function formatApiUrl(
  base: string,
  path: string,
  query: Record<string, any>
) {
  return new URL(path + "?" + qs.stringify(query), base).toString();
}
