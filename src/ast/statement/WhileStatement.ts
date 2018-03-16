import { Statement } from "./Statement";
import { Expression } from "../expression";

export class WhileStatement extends Statement {

    condition: Expression;
    block: Statement | null;

    constructor(condition: Expression, block: Statement | null) {
        super();
        this.condition = condition;
        this.block = block;
    }
}