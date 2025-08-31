import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FlightResultsPage } from "@/components/FlightResultsPage";
import { FlightService } from "@/services/flightService";
import { FlightData, CompensationInfo } from "@/types/flight";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchData, setSearchData] = useState<{
    flightData: FlightData;
    compensation: CompensationInfo;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (flightNumber: string, date: string) => {
    setIsLoading(true);
    try {
      const result = await FlightService.getFlightStatus(flightNumber, date);
      setSearchData(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch flight data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSearchData(null);
  };

  if (searchData) {
    return (
      <FlightResultsPage
        flightData={searchData.flightData}
        compensation={searchData.compensation}
        onBack={handleBack}
      />
    );
  }

  return <HeroSection onSearch={handleSearch} isLoading={isLoading} />;
};

export default Index;
