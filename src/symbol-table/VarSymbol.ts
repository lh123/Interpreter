import { Symbol } from "./Symbol";
import { TypeSymbol } from "./TypeSymbol";

export class VarSymbol extends Symbol {

    type: TypeSymbol;
    value: any;

    constructor(name: string, value: any, type: TypeSymbol) {
        super(name);
        this.type = type;
        this.value = value;
    }

    isVariable() {
        return true;
    }
}