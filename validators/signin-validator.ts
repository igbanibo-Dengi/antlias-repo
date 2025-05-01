import * as v from "valibot";

export const SigninSchema = v.object({
  email: v.pipe(
    v.string("Your email must be a string."),
    v.nonEmpty("Please enter your email."),
    v.email("Invalid Email Format"),
  ),
  password: v.pipe(
    v.string("Your password must be a string."),
    v.nonEmpty("Please enter your password."),
  ),
});

export type SigninInput = v.InferInput<typeof SigninSchema>;
