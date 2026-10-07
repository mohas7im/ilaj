// Cloudflare Worker entry: vinext's handler, with a Prisma client per request.
import handler from "vinext/server/fetch-handler";
import { runWithPrismaScope } from "./lib/prisma";

export * from "vinext/server/fetch-handler";

type FetchArgs = Parameters<typeof handler.fetch>;

export default {
  ...handler,
  fetch(...args: FetchArgs) {
    return runWithPrismaScope(() => handler.fetch(...args));
  },
};
