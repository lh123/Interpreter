import { Stmt, Expr } from "..";

export class ExprStmt implements Stmt {
    
    exp: Expr;

    constructor(exp: Expr) {
        this.exp = exp;
    }

    column(): number {
        return this.exp.column();
    }

    line(): number {
        return this.exp.line();
    }
}