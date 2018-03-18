import { Stmt } from "..";

export class EmptyStmt implements Stmt {

    mLine: number;
    mColumm: number;

    constructor(line: number, column: number) {
        this.mLine = line;
        this.mColumm = column;
    }

    column(): number {
        return this.mLine;
    }

    line(): number {
        return this.mColumm;
    }
}