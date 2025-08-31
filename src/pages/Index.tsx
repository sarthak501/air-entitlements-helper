import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FlightResultsPage } from "@/components/FlightResultsPage";

const Index = () => {
  const [searchData, setSearchData] = useState<{
    flightNumber: string;
    date: string;
  } | null>(null);

  const handleSearch = (flightNumber: string, date: string) => {
    setSearchData({ flightNumber, date });
  };

  const handleBack = () => {
    setSearchData(null);
  };

  if (searchData) {
    return (
      <FlightResultsPage
        flightNumber={searchData.flightNumber}
        date={searchData.date}
        onBack={handleBack}
      />
    );
  }

  return <HeroSection onSearch={handleSearch} />;
};

export default Index;
