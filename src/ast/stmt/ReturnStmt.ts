import { Stmt, Expr } from "..";
import { Token } from "../../frontend/Token";

export class ReturnStmt implements Stmt {

    returnToken: Token;
    expr: Expr | null;

    constructor(expr: Expr | null, returnToken: Token) {
        this.expr = expr;
        this.returnToken = returnToken;
    }

    column(): number {
        return this.returnToken.column;
    }

    line(): number {
        return this.returnToken.line;
    }
}