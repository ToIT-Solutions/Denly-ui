import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Baseline browser protections without changing Next script, image or payment navigation behavior.
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
      ],
    }, {
      // Recovery and invitation URLs contain one-time secrets.
      source: "/auth/:action(reset-password|invitation)",
      headers: [
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Cache-Control", value: "private, no-store" },
      ],
    }];
  },
};

export default nextConfig;
