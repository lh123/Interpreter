import { Stmt, Expr } from "..";
import { Token } from "../../frontend/Token";
import { BlockStmt } from "./BlockStmt";

export class DoWhileStmt implements Stmt {

    doToken: Token;
    loopBody: BlockStmt;
    testExpr: Expr;

    constructor(whileToken: Token, loopBody: BlockStmt, testExpr: Expr) {
        this.doToken = whileToken;
        this.loopBody = loopBody;
        this.testExpr = testExpr;
    }

    column(): number {
        return this.doToken.column;
    }

    line(): number {
        return this.doToken.line;
    }
}