import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import DoctorCard from "@/components/DoctorCard";
import Pagination from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Stethoscope, Clock, Video, ChevronRight, Plus } from "lucide-react";
import type { DoctorFilter, DoctorListResponse } from "@shared/schema";

export default function DoctorsPage() {
  const [filters, setFilters] = useState<DoctorFilter>({
    page: 1,
    limit: 10,
    sortBy: "relevance",
  });

  const { data, isLoading, error } = useQuery<DoctorListResponse>({
    queryKey: ["/api/list-doctor-with-filter", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/list-doctor-with-filter?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      return response.json();
    },
  });

  const updateFilters = (newFilters: Partial<DoctorFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const updatePage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-neutral-500 hover:text-blue-600">Home</a>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            <a href="#" className="text-neutral-500 hover:text-blue-600">Doctors</a>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            <span className="text-neutral-800 font-medium">General Physician & Internal Medicine</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">General Physician & Internal Medicine</h1>
            <p className="text-xl opacity-90 mb-6">Find experienced doctors for comprehensive healthcare and internal medicine consultation</p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                <span>{data?.total || 0}+ Doctors</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                <span>Video Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar filters={filters} onFiltersChange={updateFilters} />

          <main className="flex-1">
            {/* Results Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                      {isLoading ? (
                        <Skeleton className="h-6 w-32" />
                      ) : (
                        `${data?.total || 0} Doctors Available`
                      )}
                    </h2>
                    <p className="text-neutral-600">General Physician & Internal Medicine specialists</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as any })}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Sort by Relevance</SelectItem>
                        <SelectItem value="experience">Experience (High to Low)</SelectItem>
                        <SelectItem value="rating">Rating (High to Low)</SelectItem>
                        <SelectItem value="name">Name (A to Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading doctors...</p>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="p-8 text-center">
                <p className="text-red-600">Failed to load doctors. Please try again.</p>
              </Card>
            )}

            {/* Empty State */}
            {data && data.doctors.length === 0 && !isLoading && (
              <Card className="p-8 text-center">
                <p className="text-neutral-600">No doctors found matching your criteria.</p>
              </Card>
            )}

            {/* Doctor Listings */}
            {data && data.doctors.length > 0 && (
              <>
                <div className="space-y-6">
                  {data.doctors.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}
                </div>

                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  total={data.total}
                  limit={data.limit}
                  onPageChange={updatePage}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link href="/add-doctor">
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                MedConsult
              </h3>
              <p className="text-neutral-400 mb-4">Your trusted healthcare partner for online medical consultations.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white">Find Doctors</a></li>
                <li><a href="#" className="hover:text-white">Specialties</a></li>
                <li><a href="#" className="hover:text-white">Lab Tests</a></li>
                <li><a href="#" className="hover:text-white">Health Records</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-neutral-400">
                <p>+91 80 1234 5678</p>
                <p>support@medconsult.com</p>
                <p>24/7 Available</p>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 MedConsult. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
