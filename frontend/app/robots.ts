import type { MetadataRoute } from "next";

/**
 * robots.txt. Before this file the site had none (everything allowed); the only change is the NatWest Group demo,
 * which is never crawled (docs/natwest/brief.md Step 1.1). Page meta and X-Robots-Tag still apply on top.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/natwest-pulse"] }],
  };
}
