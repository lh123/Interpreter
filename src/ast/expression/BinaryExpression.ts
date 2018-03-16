import { Expression } from "./Expression";
import { Token } from "../../analysis/Token";
/**
 * 5 + a
 */
export class BinaryExpression extends Expression {

    op: string;
    leftExpression: Expression;
    rightExpression: Expression;
    token: Token;

    constructor(token: Token, left: Expression, right: Expression) {
        super();
        this.token = token;
        this.op = token.value;
        this.leftExpression = left;
        this.rightExpression = right;
    }
}