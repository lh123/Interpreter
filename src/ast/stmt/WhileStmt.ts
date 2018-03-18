import { Stmt, EmptyStmt, Expr } from "..";
import { Token } from "../../frontend/Token";
import { BlockStmt } from "./BlockStmt";

export class WhileStmt implements Stmt {

    whileToken: Token;
    testExpr: Expr;
    loopBody: BlockStmt | EmptyStmt;

    constructor(whileToken: Token, testExpr: Expr, loopBody: BlockStmt | EmptyStmt) {
        this.whileToken = whileToken;
        this.loopBody = loopBody;
        this.testExpr = testExpr;
    }

    column(): number {
        return this.whileToken.column;
    }

    line(): number {
        return this.whileToken.line;
    }
}