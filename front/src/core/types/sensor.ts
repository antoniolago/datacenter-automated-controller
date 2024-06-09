export interface ISensor {
    id: number;
    name: string;
    description: string;
    port: number;
    url: string;
}

export interface ISensorData {
    temperature: number;
    humidity: number;
}