import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the workspace root to avoid Next.js picking up a parent
    // package-lock.json in D:\code and inferring the wrong root directory.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
