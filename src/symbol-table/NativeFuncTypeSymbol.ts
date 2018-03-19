import { Symbol } from "./Symbol";
import { TypeSymbol } from "./TypeSymbol";
import { FuncDecl } from "../ast";

export class NativeFuncTypeSymbol extends TypeSymbol {

    static readonly Printf = new NativeFuncTypeSymbol("printf");

    constructor(name: string) {
        super(name);
    }

    isFunc() {
        return true;
    }

    isNativeFunc() {
        return true;
    }
}