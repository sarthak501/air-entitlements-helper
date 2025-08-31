import { ArrowLeft, Clock, Euro, AlertCircle, CheckCircle, Plane, MapPin, Clock4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlightData, CompensationInfo } from "@/types/flight";

const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatDelay = (delayMinutes?: number): string => {
  if (!delayMinutes || delayMinutes === 0) return "On time";
  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m delay`;
  }
  return `${minutes}m delay`;
};

interface FlightResultsPageProps {
  flightData: FlightData;
  compensation: CompensationInfo;
  onBack: () => void;
}

export const FlightResultsPage = ({ flightData, compensation, onBack }: FlightResultsPageProps) => {
  const delay = flightData.departure.delay || 0;
  
  const getStatusColor = (delay: number) => {
    if (delay === 0) return "default";
    if (delay < 120) return "secondary"; 
    return "destructive";
  };

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
              <h1 className="text-2xl md:text-3xl font-bold">{flightData.flight_number}</h1>
              <p className="text-primary-foreground/80">
                {flightData.departure.iata} → {flightData.arrival.iata} • {flightData.airline.name}
              </p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Departure</div>
                    <div className="font-semibold">{flightData.departure.airport}</div>
                    <div className="text-sm">
                      Scheduled: {formatTime(flightData.departure.scheduled)}
                    </div>
                    <div className="text-sm">
                      Actual: {formatTime(flightData.departure.actual || flightData.departure.scheduled)}
                    </div>
                    {flightData.departure.terminal && (
                      <div className="text-xs text-muted-foreground">Terminal {flightData.departure.terminal}</div>
                    )}
                    {flightData.departure.gate && (
                      <div className="text-xs text-muted-foreground">Gate {flightData.departure.gate}</div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Arrival</div>
                    <div className="font-semibold">{flightData.arrival.airport}</div>
                    <div className="text-sm">
                      Scheduled: {formatTime(flightData.arrival.scheduled)}
                    </div>
                    <div className="text-sm">
                      Actual: {formatTime(flightData.arrival.actual || flightData.arrival.scheduled)}
                    </div>
                    {flightData.arrival.terminal && (
                      <div className="text-xs text-muted-foreground">Terminal {flightData.arrival.terminal}</div>
                    )}
                    {flightData.arrival.gate && (
                      <div className="text-xs text-muted-foreground">Gate {flightData.arrival.gate}</div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge 
                    variant={getStatusColor(delay)}
                    className="text-sm mb-2"
                  >
                    {flightData.flight_status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {formatDelay(delay)}
                  </div>
                </div>
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