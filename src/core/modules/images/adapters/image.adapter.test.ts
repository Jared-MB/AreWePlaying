import { beforeEach, describe, expect, test, vi } from "vitest";
import { uploadImageService } from "../services/image.service";
import { uploadImage } from "./image.adapter";

vi.mock("../services/image.service", () => {
	return {
		uploadImageService: vi.fn(() => {
			return { url: "https://example.com/image.jpg", id: "123" };
		}),
	};
});

describe("Image", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should upload image", async () => {
		const data = await uploadImage(new FormData());
		expect(data).toEqual({ url: "https://example.com/image.jpg", id: "123" });
	});

	test("Should return error message if upload fails", async () => {
		vi.mocked(uploadImageService).mockRejectedValue("Error al subir la imagen");

		const data = await uploadImage(new FormData());
		expect(data).toBe("Error al subir la imagen");
	});
});
