import { Symbol } from "./Symbol";
import { TypeSymbol } from "./TypeSymbol";

export class FuncTypeSymbol extends TypeSymbol {



    constructor(name: string) {
        super(name);
    }

    isAssignbleFrom(type: TypeSymbol) {
        return false;
    }
}