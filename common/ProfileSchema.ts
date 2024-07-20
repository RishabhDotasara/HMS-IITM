import {z} from "zod"

export const ProfileSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Minimum 3 characters required in username" })
      .max(20, { message: "Maximum 20 characters allowed in username" }),
    email: z.string().email({ message: "Invalid email address" }),
    rollNo: z.string().min(8,{message:"Invalid Roll Number, must be minimum 8 characters."}),
  });

export type ProfileType = z.infer<typeof ProfileSchema>