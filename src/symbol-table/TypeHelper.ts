import { TypeSymbol } from "./TypeSymbol";
import { FuncTypeSymbol } from "./FuncTypeSymbol";

export namespace TypeHelper {

    export function isSameType(type1: TypeSymbol, type2: TypeSymbol) {
        return type1.getName() === type2.getName();
    }

    export function isAssignbleFrom(to: TypeSymbol, from: TypeSymbol) {
        if(isAnyType(to) || isAnyType(from)) {
            return true;
        }
        if (isSameType(to, from)) {
            return true;
        } else if (isRealType(to) && isIntegerType(from)) {
            return true;
        } else if (isIntegerType(to) && isIntegerType(from)) {
            return true;
        } else {
            return false;
        }
    }

    export function isCompareble(type1: TypeSymbol, type2: TypeSymbol) {
        if(isAnyType(type1) || isAnyType(type2)) {
            return true;
        }
        if (isSameType(type1, type2)) {
            return false;
        } else {
            if (isBoolType(type1) || isBoolType(type2)) {
                return false;
            } else {
                return true;
            }
        }
    }

    export function isIntegerType(type: TypeSymbol) {
        return isSameType(type, TypeSymbol.IntegerType);
    }

    export function isBoolType(type: TypeSymbol) {
        return isSameType(type, TypeSymbol.BoolType);
    }

    export function isRealType(type: TypeSymbol) {
        return isSameType(type, TypeSymbol.RealType);
    }

    export function isStringType(type: TypeSymbol) {
        return isSameType(type, TypeSymbol.StringType);
    }

    export function isAnyType(type: TypeSymbol) {
        return isSameType(type, TypeSymbol.AnyType);
    }

    export function isFuncType(type: TypeSymbol) {
        return type instanceof FuncTypeSymbol;
    }
}

