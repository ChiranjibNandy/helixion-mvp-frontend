import { z } from 'zod';

export const bookingRowSchema = z.object({
    id: z.string().optional(),
    from: z.string().trim().min(1, "'From' city is required."),
    to: z.string().trim().min(1, "'To' city is required."),
    refNo: z.string().trim().min(1, "Flight/Train Ref No. is required."),
    departureTime: z.string().trim().min(1, "Departure Time is required."),
    travelDate: z.string().min(1, "Date of Travel is required."),
    travelClass: z.string().optional(),
});

export const tourSubmissionSchema = z.object({
    travelType: z.enum(["company_assisted", "self_travel"]),
    placeOfTour: z.string().trim().optional(),
    frequentFlyerNo: z.string().trim().optional(),
    modeOfTravel: z.string().optional(),
    purpose: z.string().trim().optional(),
    advancePaymentRequired: z.number().optional(),
    bookingDetails: z.array(bookingRowSchema).optional(),
}).superRefine((data, ctx) => {
    if (data.travelType === "company_assisted") {
        if (!data.placeOfTour) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Place of Tour is required." });
        if (!data.frequentFlyerNo) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Frequent Flyer No. is required." });
        if (!data.modeOfTravel) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mode of Travel is required." });
        if (!data.purpose) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tour Purpose is required." });
        if (!data.bookingDetails || data.bookingDetails.length === 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please add at least one booking detail route." });
        }
    }
});
