import { MongoClient, Db, Collection } from 'mongodb';
import { Doctor, InsertDoctor, DoctorFilter, DoctorListResponse } from "@shared/schema";

export interface IStorage {
  insertDoctor(doctor: InsertDoctor): Promise<Doctor>;
  listDoctorsWithFilter(filter: DoctorFilter): Promise<DoctorListResponse>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db | null = null;
  private doctors: Collection<Doctor> | null = null;

  constructor() {
    const mongoUrl = process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb+srv://sahilgaikwad1238696:wFs0WwVtyg2UsrEi@cluster0.eda3emk.mongodb.net/apollo-clone";
    this.client = new MongoClient(mongoUrl);
  }

  private async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db("apollo-clone");
      this.doctors = this.db.collection<Doctor>("doctors");
      
      // Create indexes for better query performance
      await this.doctors.createIndex({ city: 1 });
      await this.doctors.createIndex({ specialty: 1 });
      await this.doctors.createIndex({ gender: 1 });
      await this.doctors.createIndex({ experience: 1 });
      await this.doctors.createIndex({ rating: -1 });
      await this.doctors.createIndex({ name: "text" });
    }
  }

  async insertDoctor(doctor: InsertDoctor): Promise<Doctor> {
    await this.connect();
    if (!this.doctors) throw new Error("Database not connected");

    const result = await this.doctors.insertOne(doctor as any);
    const insertedDoctor = await this.doctors.findOne({ _id: result.insertedId });
    
    if (!insertedDoctor) {
      throw new Error("Failed to insert doctor");
    }

    return {
      ...insertedDoctor,
      _id: insertedDoctor._id.toString(),
    } as Doctor;
  }

  async listDoctorsWithFilter(filter: DoctorFilter): Promise<DoctorListResponse> {
    await this.connect();
    if (!this.doctors) throw new Error("Database not connected");

    // Build MongoDB query
    const query: any = {};
    
    if (filter.search) {
      query.$text = { $search: filter.search };
    }
    
    if (filter.city) {
      query.city = { $regex: new RegExp(filter.city, 'i') };
    }
    
    if (filter.gender) {
      query.gender = filter.gender;
    }
    
    if (filter.experienceMin !== undefined || filter.experienceMax !== undefined) {
      query.experience = {};
      if (filter.experienceMin !== undefined) {
        query.experience.$gte = filter.experienceMin;
      }
      if (filter.experienceMax !== undefined) {
        query.experience.$lte = filter.experienceMax;
      }
    }
    
    if (filter.ratingMin !== undefined) {
      query.rating = { $gte: filter.ratingMin };
    }

    // Build sort object
    let sort: any = {};
    switch (filter.sortBy) {
      case "experience":
        sort = { experience: -1 };
        break;
      case "rating":
        sort = { rating: -1 };
        break;
      case "name":
        sort = { name: 1 };
        break;
      default:
        sort = { rating: -1, experience: -1 };
    }

    const skip = (filter.page - 1) * filter.limit;
    
    const [doctors, total] = await Promise.all([
      this.doctors.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filter.limit)
        .toArray(),
      this.doctors.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / filter.limit);

    return {
      doctors: doctors.map(doc => ({
        ...doc,
        _id: doc._id?.toString(),
      })) as Doctor[],
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages,
    };
  }
}

export const storage = new MongoStorage();
