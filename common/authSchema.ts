import { z } from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters required in username" })
    .max(20, { message: "Maximum 20 characters allowed in username" }),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 9 characters long." }),
  email: z.string().email({ message: "Invalid email address" }),
  repeatPassword:z.string().min(8,{message:"Password must be minimum 8 characters long."}),
  rollNo: z.string().min(8,{message:"Invalid Roll Number, must be minimum 8 characters."}),
  hostelId:z.string(),
  wingId:z.string(),
  roomId:z.string(),
  gender:z.string()
});

export type SignUpType = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
    rollNo:z.string().min(8,{message:"Invalid Roll Number, must be minimum 8 characters."}),
    password:z.string().min(8,{message:"Password must be minimum 8 characters long."})
})

export type SignInType = z.infer<typeof SignInSchema>