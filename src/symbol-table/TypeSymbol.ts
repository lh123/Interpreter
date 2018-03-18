import {Symbol} from "./Symbol";

export class TypeSymbol extends Symbol {

    static IntegerType = new TypeSymbol("int");
    static RealType = new TypeSymbol("real");
    static BoolType = new TypeSymbol("bool");

    constructor(name: string) {
        super(name);
    }

    getName() {
        return this.name;
    }

    isInteger() {
        return this.isSameType(TypeSymbol.IntegerType);
    }

    isBool() {
        return this.isSameType(TypeSymbol.BoolType);
    }

    isReal() {
        return this.isSameType(TypeSymbol.RealType);
    }

    isFunction() {
        
    }

    isSameType(type: TypeSymbol) {
        return this.getName() === type.getName();
    }

    isAssignbleFrom(type: TypeSymbol) {
        if (this.isSameType(type)) {
            return true;
        } else if (this.isReal() && !type.isBool()) {
            return true;
        } else if (this.isInteger() && !type.isBool()) {
            return true;
        } else {
            return false;
        }
    }

    isCompareble(type: TypeSymbol) {
        if (this.isBool() || type.isBool()) {
            return false;
        }
        return true;
    }
}