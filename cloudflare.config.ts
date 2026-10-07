import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "ilaj",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-03",
    compatibilityFlags: ["nodejs_compat"],
    workersDev: true,
    previewUrls: true,
    domains: ["ilajdentalcare.com"],
    assets: { notFoundHandling: "none" },
    // Matches the dashboard (Workers Logs on) so deploys don't switch it off
    observability: {
      logs: { enabled: true },
      issues: { enabled: false },
    },
    env: {
      
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      VINEXT_KV_CACHE: bindings.kv({
        id: "0f285eb809d443fcbae8473403e17eb9",
      }),
      DATABASE_URL: bindings.secret(),
      JWT_SECRET: bindings.secret(),
      CLOUDINARY_URL: bindings.secret(),
      RESEND_API_KEY: bindings.secret(),
      RESEND_FROM_EMAIL: bindings.secret(),
      RESEND_TO_EMAIL: bindings.secret(),
    },
  }),
});