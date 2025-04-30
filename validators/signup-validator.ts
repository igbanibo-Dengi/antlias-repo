import * as v from "valibot";

export const SignupSchema = v.pipe(
    v.object({
        // Step 1
        email: v.pipe(
            v.string("Your email must be a string."),
            v.nonEmpty("Please enter your email."),
            v.email("Invalid Email Format")
        ),
        password: v.pipe(
            v.string("Your password must be a string."),
            v.nonEmpty("Please enter your password."),
            v.minLength(6, "Your password must have 6 characters or more.")
        ),
        confirmPassword: v.pipe(
            v.string("Your password must be a string."),
            v.nonEmpty("Please confirm your password.")
        ),

        // Step 2
        companyName: v.pipe(
            v.string("Company name must be a string."),
            v.nonEmpty("Please enter your company name.")
        ),
        companyPhone: v.pipe(
            v.string("Company phone must be a string."),
            v.nonEmpty("Please enter your company phone number.")
        ),
        franchiseNumber: v.pipe(
            v.string("Franchise number must be a string."),
            v.nonEmpty("Please enter your franchise number.")
        ),
        numberOfStations: v.number("Number of stations must be a number."),

        // Step 3
        branchName: v.pipe(
            v.string("Branch name must be a string."),
            v.nonEmpty("Please enter your branch name.")
        ),
        branchAddress: v.pipe(
            v.string("Branch address must be a string."),
            v.nonEmpty("Please enter your branch address.")
        ),
        branchCity: v.pipe(
            v.string("Branch city must be a string."),
            v.nonEmpty("Please enter your branch city.")
        ),
        branchState: v.pipe(
            v.string("Branch state must be a string."),
            v.nonEmpty("Please enter your branch state.")
        ),
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "Passwords do not match."
        ),
        ["confirmPassword"]
    )
);

export type SignupInput = v.InferInput<typeof SignupSchema>;
