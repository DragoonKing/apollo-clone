import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { DoctorFilter } from "@shared/schema";

interface FilterSidebarProps {
  filters: DoctorFilter;
  onFiltersChange: (filters: Partial<DoctorFilter>) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      city: undefined,
      gender: undefined,
      experienceMin: undefined,
      experienceMax: undefined,
      ratingMin: undefined,
    });
  };

  const handleExperienceChange = (range: string, checked: boolean) => {
    if (!checked) {
      onFiltersChange({ experienceMin: undefined, experienceMax: undefined });
      return;
    }

    switch (range) {
      case "0-5":
        onFiltersChange({ experienceMin: 0, experienceMax: 5 });
        break;
      case "5-10":
        onFiltersChange({ experienceMin: 5, experienceMax: 10 });
        break;
      case "10-20":
        onFiltersChange({ experienceMin: 10, experienceMax: 20 });
        break;
      case "20+":
        onFiltersChange({ experienceMin: 20, experienceMax: undefined });
        break;
    }
  };

  const getExperienceValue = () => {
    if (filters.experienceMin === 0 && filters.experienceMax === 5) return "0-5";
    if (filters.experienceMin === 5 && filters.experienceMax === 10) return "5-10";
    if (filters.experienceMin === 10 && filters.experienceMax === 20) return "10-20";
    if (filters.experienceMin === 20 && !filters.experienceMax) return "20+";
    return "";
  };

  return (
    <aside className="lg:w-80 flex-shrink-0">
      <Card className="sticky top-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">Filter Doctors</h2>

          {/* Search */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-2">Search</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search doctors by name..."
                value={filters.search || ""}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* City Filter */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-3">City</Label>
            <Select value={filters.city || "all"} onValueChange={(value) => onFiltersChange({ city: value === "all" ? undefined : value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender Filter */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-3">Gender</Label>
            <RadioGroup value={filters.gender || "all"} onValueChange={(value) => onFiltersChange({ gender: value === "all" ? undefined : value as any })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="gender-all" />
                <Label htmlFor="gender-all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="gender-male" />
                <Label htmlFor="gender-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="gender-female" />
                <Label htmlFor="gender-female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Experience Filter */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-3">Experience</Label>
            <div className="space-y-2">
              {["0-5", "5-10", "10-20", "20+"].map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exp-${range}`}
                    checked={getExperienceValue() === range}
                    onCheckedChange={(checked) => handleExperienceChange(range, !!checked)}
                  />
                  <Label htmlFor={`exp-${range}`} className="text-sm">
                    {range === "20+" ? "20+ years" : `${range} years`}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-3">Rating</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rating-4"
                  checked={filters.ratingMin === 4}
                  onCheckedChange={(checked) => onFiltersChange({ ratingMin: checked ? 4 : undefined })}
                />
                <Label htmlFor="rating-4" className="text-sm flex items-center">
                  4+ ⭐
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rating-3"
                  checked={filters.ratingMin === 3}
                  onCheckedChange={(checked) => onFiltersChange({ ratingMin: checked ? 3 : undefined })}
                />
                <Label htmlFor="rating-3" className="text-sm flex items-center">
                  3+ ⭐
                </Label>
              </div>
            </div>
          </div>

          <Button onClick={() => onFiltersChange({})} className="w-full bg-blue-600 text-white hover:bg-blue-700 mb-2">
            Apply Filters
          </Button>
          <Button variant="ghost" onClick={clearFilters} className="w-full text-neutral-500 hover:text-neutral-700">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
