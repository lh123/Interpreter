import { Expr } from "..";
import { Token } from "../../frontend/Token";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class VarNode implements Expr {

    value: any;
    idToken: Token;
    name: string;

    constructor(idToken: Token) {
        this.idToken = idToken;
        this.name = idToken.value;
    }

    checkType(env: Environment): TypeSymbol {
        return env.getVarSymbol(this.name).type;
    }

    column(): number {
        return this.idToken.column;
    }

    line(): number {
        return this.idToken.line;
    }
}