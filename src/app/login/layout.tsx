export default function LoginLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
					<div className="flex-grow p-6 md:overflow-y-auto md:p-12">
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
