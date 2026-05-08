import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nutrivue",
    short_name: "Nutrivue",
    description: "A cleaner, more visual nutrition tracker.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcf7",
    theme_color: "#fbfcf7",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/nutrivue-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
