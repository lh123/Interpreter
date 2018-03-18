import { Expr } from "..";
import { Token } from "../../frontend/Token";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class RealNode implements Expr {

    checkType(): TypeSymbol {
        return TypeSymbol.RealType;
    }

    realToken: Token;
    value: boolean;

    constructor(intToken: Token) {
        this.realToken = intToken;
        this.value = this.realToken.value;
    }

    column(): number {
        return this.realToken.column;
    }
    
    line(): number {
        return this.realToken.line;
    }
}