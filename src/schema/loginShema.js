//Vallidation
import * as z from "zod";
export let loginschema = z
  .object({
    email: z.string().nonempty("Email is requird").email("Invalid Email"),
    password: z
      .string()
      .nonempty("Password is requird")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Invalid Password",
      ),
  })

