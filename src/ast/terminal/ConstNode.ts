import { Expr } from "..";
import { Token } from "../../frontend/Token";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class ConstNode implements Expr {

    intToken: Token;
    value: any;
    type: TypeSymbol

    constructor(intToken: Token, type: TypeSymbol) {
        this.intToken = intToken;
        this.value = intToken.value;
        this.type = type;
    }

    checkType(): TypeSymbol {
        return this.type;
    }

    column(): number {
        return this.intToken.column;
    }
    
    line(): number {
        return this.intToken.line;
    }
}