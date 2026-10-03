import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "ilaj",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-03",
    compatibilityFlags: ["nodejs_compat"],

    routes: [
      {
        pattern: "ilajdentalcare.com",
        custom_domain: true,
      },
    ],

    keep_vars: true,

    assets: {
      notFoundHandling: "none",
    },

    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      VINEXT_KV_CACHE: bindings.kv({
        id: "0f285eb809d443fcbae8473403e17eb9",
      }),
    },
  }),
});