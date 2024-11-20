import type { z } from "zod";
import type { LoginSchema, RegisterSchema } from "../validators/auth.validator";

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
