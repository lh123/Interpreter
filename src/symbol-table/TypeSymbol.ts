import {Symbol} from "./Symbol";

export class TypeSymbol extends Symbol {

    static IntegerType = new TypeSymbol("int");
    static RealType = new TypeSymbol("real");
    static BoolType = new TypeSymbol("bool");
    static VoidType = new TypeSymbol("void");
    static StringType = new TypeSymbol("string");
    static AnyType = new TypeSymbol("any");

    constructor(name: string) {
        super(name);
    }
}