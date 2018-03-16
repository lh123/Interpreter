import { Statement } from ".";
import { Expression } from "../expression";

export class ElseStatement extends Statement {
    block: Statement;

    constructor(block: Statement) {
        super();
        this.block = block;
    }
}