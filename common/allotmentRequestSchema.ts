import z from "zod"


export const AllotmentRequestSchema = z.object({
    
    hostelId:z.string({message:"Please select a Hostel"}),
    roomId:z.string({message:"Please select a Room"}),
    wingId:z.string({message:"Please select a wing"}),
})

export type AllotmentRequest = z.infer<typeof AllotmentRequestSchema>