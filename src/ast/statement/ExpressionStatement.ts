import { Statement } from ".";
import { Expression } from "..";

export class ExpressionStatement extends Statement {

    expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }
}