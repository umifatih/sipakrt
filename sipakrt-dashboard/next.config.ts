import path from "path";
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};
export default nextConfig;
