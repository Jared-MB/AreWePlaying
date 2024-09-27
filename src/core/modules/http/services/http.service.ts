/**
 * (c) 2024 Kristall
 */

"use server";

type Url = `/${string}`;

import type { ServerResponse } from "../interfaces";

import { environment } from "@/constants/environment";
import { getCookie } from "@/core/utils/cookies";
import { ServerError } from "@/core/utils/errors";

const createHeaders = async (): Promise<HeadersInit> => {
	const access_token = await getCookie("session");
	return {
		Authorization: `Bearer ${access_token}`,
		Cookie: `session=${access_token}`,
		"Content-Type": "application/json",
	};
};

interface FetchOptions {
	tags: string[];
	/**
	 * @deprecated
	 */
	toJSON?: boolean;
}

export const GET = async <T>(
	url: Url,
	options: FetchOptions = {
		tags: [],
	},
): Promise<ServerResponse<T>> => {
	const { tags, toJSON } = options;
	if (tags.length === 0) {
		console.warn("No tags provided for GET request: ", url);
	}
	if (toJSON) {
		console.warn("toJSON is deprecated, its not longer necessary on: ", url);
	}
	const response = await fetch(`${environment.SERVER_API}${url}`, {
		method: "GET",
		headers: await createHeaders(),
		next: {
			tags: options?.tags,
		},
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	try {
		return response.json();
	} catch (_error) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return response.text() as any;
	}
};

export const POST = async <T, R = unknown>(
	url: Url,
	body: T,
): Promise<ServerResponse<R>> => {
	const response = await fetch(`${environment.SERVER_API}${url}`, {
		method: "POST",
		headers: await createHeaders(),
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new ServerError(error);
	}
	return await response.json();
};

export const PUT = async <T, R = unknown>(
	url: Url,
	body: T,
): Promise<ServerResponse<R>> => {
	const response = await fetch(`${environment.SERVER_API}${url}`, {
		method: "PUT",
		headers: await createHeaders(),
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return await response.json();
};

export const DELETE = async (url: Url): Promise<ServerResponse<null>> => {
	const response = await fetch(`${environment.SERVER_API}${url}`, {
		method: "DELETE",
		headers: await createHeaders(),
	});
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	return await response.json();
};
