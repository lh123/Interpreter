import { Expression } from "./Expression";
import { Token } from "../../analysis/Token";

export class ConstNumberExpression extends Expression {

    token: Token;
    value: number;

    constructor(token: Token) {
        super();
        this.token = token;
        this.value = token.value;
    }

}