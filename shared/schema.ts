import { z } from "zod";

// Doctor schema for MongoDB
export const doctorSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  gender: z.enum(["male", "female"]),
  city: z.string().min(1, "City is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
  rating: z.number().min(0).max(5),
  image: z.string().url("Invalid image URL"),
  hospital: z.string().optional(),
  fee: z.number().min(0, "Fee must be a positive number"),
  reviewCount: z.number().min(0).optional(),
});

export const insertDoctorSchema = doctorSchema.omit({ _id: true });

export type Doctor = z.infer<typeof doctorSchema>;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

// Filter schema
export const doctorFilterSchema = z.object({
  search: z.string().optional(),
  specialty: z.string().optional(),
  city: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  experienceMin: z.number().optional(),
  experienceMax: z.number().optional(),
  ratingMin: z.number().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  sortBy: z.enum(["relevance", "experience", "rating", "name"]).default("relevance"),
});

export type DoctorFilter = z.infer<typeof doctorFilterSchema>;

// Response schema
export const doctorListResponseSchema = z.object({
  doctors: z.array(doctorSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type DoctorListResponse = z.infer<typeof doctorListResponseSchema>;
