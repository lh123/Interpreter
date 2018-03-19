import { Stmt, Expr, VarNode } from "..";
import { Token } from "../../frontend/Token";

export class AssignStmt implements Stmt {

    varNode: VarNode;
    opToken: Token;
    expr: Expr;

    constructor(varNode: VarNode, opToken: Token, expr: Expr){
        this.varNode = varNode;
        this.opToken = opToken;
        this.expr = expr;
    }

    column(): number {
        throw this.varNode.column();
    }

    line(): number {
        throw this.varNode.line();
    }
}