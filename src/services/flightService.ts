import { FlightData, CompensationInfo } from "@/types/flight";

// For demo purposes, I'm using a free API. In production, you'd want to use a paid service
// with higher rate limits and more reliable data.
const AVIATION_STACK_API_URL = "http://api.aviationstack.com/v1/flights";
const API_KEY = "YOUR_API_KEY"; // This should be managed through environment or user input

// EU airport codes for compensation eligibility
const EU_AIRPORT_CODES = [
  'LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'FCO', 'MUC', 'ZUR', 'VIE', 'CPH',
  'ARN', 'OSL', 'HEL', 'WAW', 'PRG', 'BUD', 'ATH', 'LIS', 'OPO', 'BCN',
  'BRU', 'DUB', 'EDI', 'MAN', 'STN', 'LGW', 'ORY', 'TXL', 'HAM', 'STR'
  // Add more EU airport codes as needed
];

export class FlightService {
  private static async fetchFlightData(flightNumber: string, date: string): Promise<FlightData | null> {
    try {
      // Remove spaces and convert to uppercase
      const cleanFlightNumber = flightNumber.replace(/\s+/g, '').toUpperCase();
      
      // For demo purposes without API key, return realistic sample data
      // In production, uncomment the real API call below
      
      /*
      const response = await fetch(
        `${AVIATION_STACK_API_URL}?access_key=${API_KEY}&flight_iata=${cleanFlightNumber}&flight_date=${date}`
      );
      
      if (!response.ok) {
        throw new Error('Flight data not found');
      }
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No flight data available');
      }
      
      return data.data[0];
      */
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return realistic sample data based on flight number
      return this.generateRealisticFlightData(cleanFlightNumber, date);
      
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw new Error('Unable to fetch flight information. Please check your flight number and try again.');
    }
  }

  private static generateRealisticFlightData(flightNumber: string, date: string): FlightData {
    // Extract airline code
    const airlineCode = flightNumber.substring(0, 2);
    const flightNum = flightNumber.substring(2);
    
    // Common airline mappings
    const airlines: Record<string, { name: string; routes: { dep: string; arr: string; }[] }> = {
      'BA': { 
        name: 'British Airways', 
        routes: [
          { dep: 'LHR', arr: 'CDG' },
          { dep: 'LHR', arr: 'FRA' },
          { dep: 'LGW', arr: 'BCN' }
        ]
      },
      'LH': { 
        name: 'Lufthansa', 
        routes: [
          { dep: 'FRA', arr: 'LHR' },
          { dep: 'MUC', arr: 'CDG' },
          { dep: 'FRA', arr: 'JFK' }
        ]
      },
      'AF': { 
        name: 'Air France', 
        routes: [
          { dep: 'CDG', arr: 'LHR' },
          { dep: 'CDG', arr: 'FRA' },
          { dep: 'ORY', arr: 'BCN' }
        ]
      },
      'AA': { 
        name: 'American Airlines', 
        routes: [
          { dep: 'JFK', arr: 'LHR' },
          { dep: 'LAX', arr: 'LHR' },
          { dep: 'JFK', arr: 'CDG' }
        ]
      }
    };

    const airline = airlines[airlineCode] || { 
      name: 'Sample Airline', 
      routes: [{ dep: 'LHR', arr: 'CDG' }] 
    };
    
    const route = airline.routes[Math.floor(Math.random() * airline.routes.length)];
    
    // Generate realistic delays (weighted toward common scenarios)
    const delayScenarios = [0, 15, 30, 45, 90, 120, 180, 240, 300];
    const delayWeights = [0.3, 0.2, 0.15, 0.1, 0.1, 0.05, 0.05, 0.03, 0.02];
    
    let delay = 0;
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < delayWeights.length; i++) {
      cumulative += delayWeights[i];
      if (random <= cumulative) {
        delay = delayScenarios[i];
        break;
      }
    }

    const scheduledDep = new Date(`${date}T14:30:00`);
    const scheduledArr = new Date(`${date}T16:45:00`);
    const actualDep = new Date(scheduledDep.getTime() + (delay * 60000));
    const actualArr = new Date(scheduledArr.getTime() + (delay * 60000));

    return {
      flight_number: flightNumber,
      airline: {
        name: airline.name,
        iata: airlineCode,
        icao: airlineCode + 'A'
      },
      departure: {
        airport: this.getAirportName(route.dep),
        iata: route.dep,
        icao: route.dep + 'A',
        terminal: Math.random() > 0.5 ? String(Math.floor(Math.random() * 5) + 1) : undefined,
        gate: Math.random() > 0.3 ? String(Math.floor(Math.random() * 50) + 1) : undefined,
        scheduled: scheduledDep.toISOString(),
        actual: delay > 0 ? actualDep.toISOString() : scheduledDep.toISOString(),
        delay: delay
      },
      arrival: {
        airport: this.getAirportName(route.arr),
        iata: route.arr,
        icao: route.arr + 'A',
        terminal: Math.random() > 0.5 ? String(Math.floor(Math.random() * 5) + 1) : undefined,
        gate: Math.random() > 0.3 ? String(Math.floor(Math.random() * 50) + 1) : undefined,
        scheduled: scheduledArr.toISOString(),
        actual: delay > 0 ? actualArr.toISOString() : scheduledArr.toISOString(),
        delay: delay
      },
      flight_status: this.getStatusByDelay(delay)
    };
  }

  private static getStatusByDelay(delay: number): string {
    if (delay === 0) return 'On Time';
    if (delay < 30) return 'Slight Delay';
    if (delay < 120) return 'Delayed';
    if (delay < 180) return 'Significantly Delayed';
    return 'Major Delay';
  }

  private static getAirportName(code: string): string {
    const airports: Record<string, string> = {
      'LHR': 'London Heathrow',
      'CDG': 'Paris Charles de Gaulle',
      'FRA': 'Frankfurt',
      'JFK': 'New York JFK',
      'LAX': 'Los Angeles',
      'BCN': 'Barcelona',
      'MUC': 'Munich',
      'LGW': 'London Gatwick',
      'ORY': 'Paris Orly'
    };
    return airports[code] || `${code} Airport`;
  }

  public static async getFlightStatus(flightNumber: string, date: string): Promise<{
    flightData: FlightData;
    compensation: CompensationInfo;
  }> {
    const flightData = await this.fetchFlightData(flightNumber, date);
    
    if (!flightData) {
      throw new Error('Flight not found');
    }

    const compensation = this.calculateCompensation(flightData);
    
    return { flightData, compensation };
  }

  private static calculateCompensation(flightData: FlightData): CompensationInfo {
    const delay = flightData.departure.delay || 0;
    const isEuRoute = this.isEuRoute(flightData);
    
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
        ],
        delayMinutes: delay
      };
    }

    // EU compensation rules (EC 261/2004)
    if (delay >= 180) { // 3+ hours
      const distance = this.getFlightDistance(flightData.departure.iata, flightData.arrival.iata);
      let amount = 250; // Default for short flights
      
      if (distance > 1500 && distance <= 3500) {
        amount = 400;
      } else if (distance > 3500) {
        amount = 600;
      }
      
      return {
        region: "EU",
        eligible: true,
        amount: amount,
        message: "Great news! You're likely entitled to compensation under EU Regulation 261/2004.",
        rights: [
          `€${amount} compensation per passenger`,
          "Meals and refreshments",
          "Hotel accommodation if needed",
          "Right to refund or rebooking"
        ],
        delayMinutes: delay
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
      ],
      delayMinutes: delay
    };
  }

  private static isEuRoute(flightData: FlightData): boolean {
    return EU_AIRPORT_CODES.includes(flightData.departure.iata) || 
           EU_AIRPORT_CODES.includes(flightData.arrival.iata);
  }

  private static getFlightDistance(depIata: string, arrIata: string): number {
    // Simplified distance calculation - in reality you'd use airport coordinates
    const distances: Record<string, Record<string, number>> = {
      'LHR': { 'CDG': 344, 'FRA': 659, 'JFK': 5540 },
      'CDG': { 'LHR': 344, 'FRA': 479, 'BCN': 831 },
      'FRA': { 'LHR': 659, 'CDG': 479, 'JFK': 6194 }
    };
    
    return distances[depIata]?.[arrIata] || 1000; // Default medium distance
  }
}