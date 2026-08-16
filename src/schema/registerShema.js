//Vallidation
import * as z from "zod";
export let schema = z
  .object({
    name: z
      .string()
      .nonempty("Name is requird")
      .min(3, "Min 3 letters")
      .max(8, "Max 8 letters"),
    username: z
      .string()
      .nonempty("Username is requird")
      .regex(/^[A-Z][a-z0-9]{5,10}$/, "Invalid UserName"),

    email: z.string().nonempty("Email is requird").email("Invalid Email"),
    password: z
      .string()
      .nonempty("Password is requird")
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Invalid Password"),
    gender: z.string().nonempty("Gender is requird"),
    dateOfBirth: z.coerce.date("Date Required").refine((dateVal) => {
      let current = new Date().getFullYear();
      let year = dateVal.getFullYear();
      let age = current - year;

      if (age > 20) {
        return true;
      } else {
        return false;
      }
    }, "Age must be greater than 20"),
    rePassword: z.string().nonempty("Repassword is requird"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { path: ["rePassword"], message: "Password and Repass not match" },
  );
