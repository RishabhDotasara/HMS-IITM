import z from "zod"


export const AllotmentRequestSchema = z.object({
    
    gender:z.string({message:"Please select a gender"}),
    hostelId:z.string({message:"Please select a Hostel"}),
    roomId:z.string({message:"Please select a Room"}),
    wingId:z.string({message:"Please select a wing"}),
    roomType:z.string({message:"Please select a room type"}),
    roommate1:z.string({message:"Please select a roommate"}).optional(),
    roommate2:z.string({message:"Please select a roommate"}).optional(),
})

export type AllotmentRequest = z.infer<typeof AllotmentRequestSchema>