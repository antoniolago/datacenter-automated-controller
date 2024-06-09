export interface IRule {
    id: number;
    name: string;
    forceOnline: boolean;
    wolAttempts: number;
    description: string;
    minTemperature: number;
    maxTemperature: number;
    minHumidity: number;
    maxHumidity: number;
    minVoltage: number;
    maxVoltage: number;
    minCurrent: number;
    maxCurrent: number;
    minPower: number;
    chargeToShutdown: number;
    chargeToWol: number;
}