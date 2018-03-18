import { Stmt } from "../base/Stmt";
import { Token } from "../../frontend/Token";

export class BlockStmt implements Stmt {

    letftBranch: Token;
    rightBranch: Token;

    stmtList: Stmt[];

    constructor(leftBranch: Token, stmtList: Stmt[], rightBranch: Token) {
        this.letftBranch = leftBranch;
        this.stmtList = stmtList;
        this.rightBranch = rightBranch;
    }

    column(): number {
        return this.letftBranch.column;
    }

    line(): number {
        return this.rightBranch.line;
    }
}