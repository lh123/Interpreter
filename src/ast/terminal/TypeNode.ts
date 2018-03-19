import { Expr } from "..";
import { Token } from "../../frontend/Token";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class TypeNode implements Expr {

    value: any;
    idToken: Token;
    name: string;

    constructor(idToken: Token) {
        this.idToken = idToken;
        this.name = idToken.value;
    }

    setValue(value: any): void {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    checkType(env: Environment): TypeSymbol {
        return env.getTypeSymbol(this.name);
    }

    column(): number {
        return this.idToken.column;
    }

    line(): number {
        return this.idToken.line;
    }
}