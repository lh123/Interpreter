import {Symbol} from "./Symbol";

export class TypeSymbol extends Symbol {

    static IntegerType = new TypeSymbol("int");
    static RealType = new TypeSymbol("real");
    static BoolType = new TypeSymbol("bool");

    constructor(name: string) {
        super(name);
    }
}