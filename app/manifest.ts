import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Someday — You'll miss today.",
    short_name: "Someday",
    description: "未来の自分から今日を見ることで、今という時間の大切さを思い出すWebサービス。",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#faf9f6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
