import { useState } from "react";
import { Calendar, Plane, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface FlightSearchFormProps {
  onSearch: (flightNumber: string, date: string) => void;
  isLoading?: boolean;
}

export const FlightSearchForm = ({ onSearch, isLoading = false }: FlightSearchFormProps) => {
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber && date) {
      onSearch(flightNumber, date);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card bg-card/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flight-number" className="text-foreground font-medium">
              Flight Number
            </Label>
            <div className="relative">
              <Plane className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="flight-number"
                type="text"
                placeholder="e.g., AA123, BA456"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                className="pl-10 h-12 text-base"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="flight-date" className="text-foreground font-medium">
              Flight Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="flight-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 h-12 text-base"
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Checking Flight...
              </>
            ) : (
              'Check My Rights'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};