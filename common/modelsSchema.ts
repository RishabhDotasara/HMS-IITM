import z from "zod"

export const HostelSchema = z.object({
    name:z.string({message:"Name is required"}),
    sRooms:z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: "Single Rooms must be a non-negative integer" })),
    dRooms:z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: "Double Rooms must be a non-negative integer" })),
    tRooms:z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: "Triple Rooms must be a non-negative integer" })),
    gender: z.enum(["male", "female"], { message: "Gender is required!" })
})

export type HostelCreate = z.infer<typeof HostelSchema>

export const WingSchema = z.object({
    name:z.string({message:"name required!"}),
    hostel:z.string({message:"hostel required!"})
})

export type WingCreate = z.infer<typeof WingSchema>

export const RoomSchema = z.object({
    name:z.string({message:"name required!"}),
    wing:z.string({message:"wing required"}),
    capacity:z.preprocess((val) => Number(val), z.number().int().nonnegative({ message: "Capacity must be a non-negative integer" })),
    hostel:z.string({message:"hostel required"})
})

export type RoomCreate = z.infer<typeof RoomSchema>

export const SuperUserCreateSchema = z.object({
    user:z.string({message:"User is required"}),
})

export type SuperUserAdd = z.infer<typeof SuperUserCreateSchema>