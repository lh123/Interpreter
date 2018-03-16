import { Statement } from "./statement";

export class Program {
    statementList: Statement[];

    constructor(statements: Statement[]) {
        this.statementList = statements;
    }
}