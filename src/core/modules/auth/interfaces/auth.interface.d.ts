import type { z } from "zod";
import type { LoginSchema } from "../validators/auth.validator";

export type Login = z.infer<typeof LoginSchema>;
