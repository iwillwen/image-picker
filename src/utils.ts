import type { NextApiResponse } from "next";
import qs from "query-string";

export function formatApiUrl(
  base: string,
  path: string,
  query: Record<string, any>
) {
  return new URL(path + "?" + qs.stringify(query), base).toString();
}

export async function within<T extends (...args: unknown[]) => unknown>(
  fn: T,
  res: NextApiResponse,
  duration: number
) {
  const id = setTimeout(
    () =>
      res.json({
        message: "There was an error with the upstream service!",
      }),
    duration
  );

  try {
    let data = await fn();
    clearTimeout(id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
