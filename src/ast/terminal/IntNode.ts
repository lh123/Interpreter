import { Expr } from "..";
import { Token } from "../../frontend/Token";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class IntNode implements Expr {

    checkType(): TypeSymbol {
        return TypeSymbol.IntegerType;
    }

    intToken: Token;
    value: number;

    constructor(intToken: Token) {
        this.intToken = intToken;
        this.value = intToken.value;
    }

    column(): number {
        return this.intToken.column;
    }
    
    line(): number {
        return this.intToken.line;
    }
}