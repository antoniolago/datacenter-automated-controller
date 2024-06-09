import { IArgument } from "./arguments";
import { IMachine } from "./machine";
import { IRule } from "./rule";

export interface INobreak {
    id: number;
    name: string;
    driver: string;
    description: string;
    ruleId: string;
    port: number;
    arguments: IArgument[];
    rule: IRule;
    machines: IMachine[];
    outputVoltage: number;
    inputVoltage: number;
    load: number;
    batteryCharge: number;
}