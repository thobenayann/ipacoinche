import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ipacoinche — Tournoi de Coinche",
    short_name: "Ipacoinche",
    description:
      "Application mobile de gestion de tournois de coinche par IPANOVA",
    start_url: "/app",
    display: "standalone",
    background_color: "#f0f0f0",
    theme_color: "#51bdcb",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
