import { Statement } from "./Statement";

export class BlockStatement extends Statement {
    statements: Statement[];

    constructor(statements: Statement[]) {
        super();
        this.statements = statements;
    }
}