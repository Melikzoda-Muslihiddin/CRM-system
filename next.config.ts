import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Разрешаем загрузку картинок с этих доменов
    // Next.js Image компонент по умолчанию блокирует внешние домены из соображений безопасности
    remotePatterns: [
      { hostname: "cdn.jsdelivr.net" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;