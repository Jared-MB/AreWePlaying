import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	reactCompiler: true,
	typedRoutes: true,
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
	allowedDevOrigins: ["192.168.100.28"],
};

export default nextConfig;
