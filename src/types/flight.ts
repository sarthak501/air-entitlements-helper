export interface FlightData {
  flight_number: string;
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  departure: {
    airport: string;
    iata: string;
    icao: string;
    terminal?: string;
    gate?: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    delay?: number;
  };
  arrival: {
    airport: string;
    iata: string;
    icao: string;
    terminal?: string;
    gate?: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    delay?: number;
  };
  flight_status: string;
  live?: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
  };
}

export interface CompensationInfo {
  region: "EU" | "Non-EU";
  eligible: boolean;
  amount: number;
  message: string;
  rights: string[];
  delayMinutes?: number;
}

export interface FlightSearchParams {
  flightNumber: string;
  date: string;
}