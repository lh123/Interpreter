import { Stmt, Expr } from "..";
import { BlockStmt } from "./BlockStmt";
import { Token } from "../../frontend/Token";

export class IfStmt implements Stmt {

    ifToken: Token;
    testExpr: Expr;
    trueBlock: BlockStmt;
    falseBlock: BlockStmt | null;

    constructor(ifToken: Token, testExpr: Expr, trueBlock: BlockStmt, falseBlock: BlockStmt | null) {
        this.ifToken = ifToken;
        this.testExpr = testExpr;
        this.trueBlock = trueBlock;
        this.falseBlock = falseBlock;
    }

    column(): number {
        return this.ifToken.column;
    }
    
    line(): number {
        return this.ifToken.line;
    }
}