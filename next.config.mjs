/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: "dist",
	async redirects() {
		return [
			{
				source: "/admin",
				destination: "/admin/match",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
