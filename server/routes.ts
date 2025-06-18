import type { Express } from "express";
import { storage } from "./storage.js";
import { insertDoctorSchema, doctorFilterSchema } from "../shared/schema.js";

export function registerRoutes(app: Express): void {
  
  // POST /api/add-doctor - Add a new doctor
  app.post("/api/add-doctor", async (req, res) => {
    try {
      const validatedData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.insertDoctor(validatedData);
      res.status(201).json(doctor);
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // GET /api/list-doctor-with-filter - List doctors with filters
  app.get("/api/list-doctor-with-filter", async (req, res) => {
    try {
      // Parse query parameters
      const filterData: any = {
        search: req.query.search as string,
        specialty: req.query.specialty as string,
        city: req.query.city as string,
        gender: req.query.gender as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: req.query.sortBy as string || "relevance",
      };

      // Handle experience range
      if (req.query.experienceMin) {
        filterData.experienceMin = parseInt(req.query.experienceMin as string);
      }
      if (req.query.experienceMax) {
        filterData.experienceMax = parseInt(req.query.experienceMax as string);
      }

      // Handle rating filter
      if (req.query.ratingMin) {
        filterData.ratingMin = parseFloat(req.query.ratingMin as string);
      }

      // Remove undefined values
      Object.keys(filterData).forEach(key => {
        if (filterData[key] === undefined || filterData[key] === '' || filterData[key] === null) {
          delete filterData[key];
        }
      });

      const validatedFilter = doctorFilterSchema.parse(filterData);
      
      try {
        const result = await storage.listDoctorsWithFilter(validatedFilter);
        res.json(result);
      } catch (dbError: any) {
        console.error("Database connection error, using fallback data:", dbError.message);
        
        // Fallback sample data for demonstration
        const sampleDoctors = [
          {
            _id: "1",
            name: "Dr. Rajesh Kumar",
            specialty: "General Physician",
            gender: "male" as const,
            city: "Mumbai",
            experience: 15,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
            hospital: "Apollo Hospital",
            fee: 500,
            reviewCount: 125
          },
          {
            _id: "2", 
            name: "Dr. Priya Sharma",
            specialty: "Internal Medicine",
            gender: "female" as const,
            city: "Delhi",
            experience: 12,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
            hospital: "Max Healthcare",
            fee: 600,
            reviewCount: 89
          },
          {
            _id: "3",
            name: "Dr. Amit Patel",
            specialty: "General Physician",
            gender: "male" as const,
            city: "Pune",
            experience: 8,
            rating: 4.3,
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
            hospital: "Ruby Hall Clinic",
            fee: 400,
            reviewCount: 67
          },
          {
            _id: "4",
            name: "Dr. Sneha Gupta",
            specialty: "Internal Medicine", 
            gender: "female" as const,
            city: "Bangalore",
            experience: 10,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1594824720207-c1f7465ad6c6?w=400&h=400&fit=crop&crop=face",
            hospital: "Manipal Hospital",
            fee: 550,
            reviewCount: 102
          },
          {
            _id: "5",
            name: "Dr. Vikram Singh",
            specialty: "General Physician",
            gender: "male" as const,
            city: "Chennai",
            experience: 20,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
            hospital: "Apollo Hospital",
            fee: 700,
            reviewCount: 156
          }
        ];

        // Apply basic filtering
        let filteredDoctors = sampleDoctors;
        
        if (validatedFilter.search) {
          filteredDoctors = filteredDoctors.filter(doc => 
            doc.name.toLowerCase().includes(validatedFilter.search!.toLowerCase())
          );
        }
        
        if (validatedFilter.city) {
          filteredDoctors = filteredDoctors.filter(doc => 
            doc.city.toLowerCase().includes(validatedFilter.city!.toLowerCase())
          );
        }
        
        if (validatedFilter.gender) {
          filteredDoctors = filteredDoctors.filter(doc => doc.gender === validatedFilter.gender);
        }

        const total = filteredDoctors.length;
        const totalPages = Math.ceil(total / validatedFilter.limit);
        const start = (validatedFilter.page - 1) * validatedFilter.limit;
        const paginatedDoctors = filteredDoctors.slice(start, start + validatedFilter.limit);

        res.json({
          doctors: paginatedDoctors,
          total,
          page: validatedFilter.page,
          limit: validatedFilter.limit,
          totalPages
        });
      }
    } catch (error: any) {
      console.error("Error listing doctors:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ 
          message: "Invalid filter parameters", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });


}
