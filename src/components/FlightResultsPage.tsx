import { ArrowLeft, Clock, Euro, AlertCircle, CheckCircle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FlightResultsPageProps {
  flightNumber: string;
  date: string;
  onBack: () => void;
}

// Mock data - In real app, this would come from flight API
const getMockFlightData = (flightNumber: string) => {
  const delays = [45, 180, 25, 240, 90, 0];
  const delay = delays[Math.floor(Math.random() * delays.length)];
  
  return {
    flightNumber,
    airline: flightNumber.substring(0, 2),
    route: "LHR → CDG",
    scheduledTime: "14:30",
    actualTime: delay > 0 ? `${14 + Math.floor(delay / 60)}:${30 + (delay % 60)}` : "14:30",
    delay,
    status: delay === 0 ? "On Time" : delay < 180 ? "Delayed" : "Significantly Delayed",
  };
};

const getCompensationInfo = (delay: number, flightNumber: string) => {
  const isEuRoute = Math.random() > 0.3; // 70% chance of EU route
  
  if (!isEuRoute) {
    return {
      region: "Non-EU",
      eligible: false,
      amount: 0,
      message: "This flight is not covered by EU compensation rules, but you may have other rights.",
      rights: [
        "Refund if flight cancelled",
        "Rebooking on next available flight",
        "Meals and refreshments for delays over 2 hours",
        "Hotel accommodation for overnight delays",
        "Transportation to/from hotel"
      ]
    };
  }

  if (delay >= 180) { // 3+ hours
    return {
      region: "EU",
      eligible: true,
      amount: delay >= 210 ? 600 : 400, // €600 for 3.5+ hours, €400 for 3+ hours
      message: "Great news! You're likely entitled to compensation under EU Regulation 261/2004.",
      rights: [
        `€${delay >= 210 ? 600 : 400} compensation per passenger`,
        "Meals and refreshments",
        "Hotel accommodation if needed", 
        "Right to refund or rebooking"
      ]
    };
  }

  return {
    region: "EU", 
    eligible: false,
    amount: 0,
    message: "Unfortunately, delays under 3 hours don't qualify for EU compensation.",
    rights: [
      "Meals and refreshments for delays over 2 hours",
      "Hotel accommodation for overnight delays",
      "Transportation to/from hotel",
      "Right to rebooking"
    ]
  };
};

export const FlightResultsPage = ({ flightNumber, date, onBack }: FlightResultsPageProps) => {
  const flightData = getMockFlightData(flightNumber);
  const compensation = getCompensationInfo(flightData.delay, flightNumber);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Search
          </Button>
          
          <div className="flex items-center gap-4">
            <Plane className="h-8 w-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{flightData.flightNumber}</h1>
              <p className="text-primary-foreground/80">{flightData.route} • {date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Status */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Flight Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Scheduled</div>
                  <div className="text-lg font-semibold">{flightData.scheduledTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Actual</div>
                  <div className="text-lg font-semibold">{flightData.actualTime}</div>
                </div>
                <div>
                  <Badge 
                    variant={flightData.delay === 0 ? "default" : flightData.delay < 180 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {flightData.status}
                  </Badge>
                </div>
                {flightData.delay > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Delay: </span>
                    {Math.floor(flightData.delay / 60)}h {flightData.delay % 60}m
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Compensation Results */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {compensation.eligible ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-warning" />
                  )}
                  Your Rights & Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Message */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  compensation.eligible 
                    ? 'bg-success/10 border-success text-success-foreground' 
                    : 'bg-warning/10 border-warning text-warning-foreground'
                }`}>
                  <p className="font-medium">{compensation.message}</p>
                </div>

                {/* Compensation Amount */}
                {compensation.eligible && (
                  <div className="text-center py-6 bg-gradient-success rounded-lg text-success-foreground">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Euro className="h-8 w-8" />
                      <span className="text-4xl font-bold">{compensation.amount}</span>
                    </div>
                    <p className="text-sm opacity-90">Potential compensation per passenger</p>
                  </div>
                )}

                {/* Rights List */}
                <div>
                  <h3 className="font-semibold mb-3">Your Rights Include:</h3>
                  <ul className="space-y-2">
                    {compensation.rights.map((right, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                        <span className="text-sm">{right}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  {compensation.eligible ? (
                    <div className="space-y-3">
                      <Button variant="success" size="lg" className="w-full">
                        Claim My €{compensation.amount} Now
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        We'll connect you with trusted compensation specialists. No win, no fee.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="cta" size="lg" className="w-full">
                        Learn About My Rights
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Get detailed information about what the airline owes you.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How it works</h4>
                <ul className="space-y-1">
                  <li>• Free eligibility check in 2 minutes</li>
                  <li>• We connect you with legal experts</li>
                  <li>• They handle everything for you</li>
                  <li>• You get paid when they win</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Coverage</h4>
                <ul className="space-y-1">
                  <li>• All EU flights (departing or arriving)</li>
                  <li>• Delays over 3 hours</li>
                  <li>• Flight cancellations</li>
                  <li>• Denied boarding/overbooking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};