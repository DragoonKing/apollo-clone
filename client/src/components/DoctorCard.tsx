import { Star, MapPin, Video, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Doctor } from "@shared/schema";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-neutral-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-32 h-32 rounded-xl object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-1">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-neutral-600 mr-4">{doctor.experience} years experience</span>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(doctor.rating)}
                    </div>
                    <span className="text-sm text-neutral-600">
                      {doctor.rating} ({doctor.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-neutral-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{doctor.city}</span>
                  {doctor.hospital && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{doctor.hospital}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <Video className="h-3 w-3 mr-1" />
                    Video Consultation
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    <Clock className="h-3 w-3 mr-1" />
                    Available Today
                  </Badge>
                </div>
              </div>
              <div className="text-right mt-4 sm:mt-0">
                <div className="text-2xl font-bold text-neutral-800 mb-1">₹{doctor.fee}</div>
                <div className="text-sm text-neutral-600 mb-4">Consultation Fee</div>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
