export interface ISensor {
    id: number;
    name: string;
    description: string;
    pin: number;
    minCriticalTemperatureThreshold: number;
    maxCriticalTemperatureThreshold: number;
    minCriticalHumidityThreshold: number;
    maxCriticalHumidityThreshold: number;
    minWarningTemperatureThreshold: number;
    maxWarningTemperatureThreshold: number;
    minWarningHumidityThreshold: number;
    maxWarningHumidityThreshold: number;
    data: ISensorData;
}

export interface ISensorData {
    temperature: number;
    humidity: number;
}