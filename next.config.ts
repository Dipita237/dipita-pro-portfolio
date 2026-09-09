import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  webpack: (config, options) => {
    // Keep your existing customizations here if needed
    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // You can add remark/rehype plugins here later if needed
  },
});

export default withMDX(nextConfig);
