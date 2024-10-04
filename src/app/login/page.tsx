"use client";
import { useState } from "react";

export default function Page() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({ email, password });
	};

	return (
		<div className="rounded-xl p-5 dark:bg-zinc-700/10 shadow relative max-w-sm mx-auto">
			<div className="flex justify-center mb-4">
				<span className="text-purple-600 font-semibold text-3xl">Login</span>
			</div>

			<form onSubmit={handleSubmit} className="grid gap-4">
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-medium">
						Email
					</label>
					<input
						type="email"
						id="email"
						className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="password" className="block text-sm font-medium">
						Password
					</label>
					<input
						type="password"
						id="password"
						className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full bg-purple-600 text-white py-2 px-4 rounded-md shadow hover:bg-purple-700"
				>
					Login
				</button>
			</form>
		</div>
	);
}
