import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	reactCompiler: true,
	typedRoutes: true,
	experimental: {
		viewTransition: true,
		turbopackFileSystemCacheForDev: true,
	},
};

export default nextConfig;
