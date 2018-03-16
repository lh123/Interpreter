import { Statement } from "./Statement";
import { Expression } from "../expression";

export class DoWhileStatement extends Statement {

    block: Statement;
    condition: Expression;

    constructor(block: Statement, condition: Expression) {
        super();
        this.block = block;
        this.condition = condition;
    }
}