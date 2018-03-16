import { Expression } from "./Expression";
import { Token } from "../../analysis/Token";
/**
 * 5 + a
 */
export class UnaryExpression extends Expression {

    op: string;
    expression: Expression;

    token: Token;

    constructor(token: Token, exp: Expression) {
        super();
        this.token = token;
        this.op = token.value;
        this.expression = exp;
    }
}