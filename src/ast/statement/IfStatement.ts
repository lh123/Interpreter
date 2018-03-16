import { Statement } from ".";
import { Expression } from "../expression";

export class IfStatement extends Statement {
    expression: Expression;
    trueBranch: Statement;
    falseBranch: Statement|null;

    constructor(expression: Expression, trueBranch: Statement, falseBranch: Statement|null) {
        super();
        this.expression = expression;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }
}