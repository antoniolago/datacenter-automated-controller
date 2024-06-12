export interface IMachine {
    id: number;
    name: string;
    description: string;
    isOnline: boolean;
    host: string;
    mac: string;
    operationalSystemId: number;
    inheritRules: boolean;
    nobreakId: number;
    ruleId: number;
    credentialId: number;
    inheritRule: boolean;
}

export interface IOperationalSystem {
    id: number;
    name: string;
}