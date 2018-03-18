import { Expr } from "..";
import { Token } from "../../frontend/Token";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class BoolNode implements Expr {

    checkType(): TypeSymbol {
        return TypeSymbol.BoolType;
    }

    boolToken: Token;
    value: boolean;

    constructor(intToken: Token) {
        this.boolToken = intToken;
        this.value = this.boolToken.value;
    }

    column(): number {
        return this.boolToken.column;
    }
    
    line(): number {
        return this.boolToken.line;
    }
}