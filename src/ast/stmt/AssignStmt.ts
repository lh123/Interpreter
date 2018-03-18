import { Stmt, Expr, IndentNode } from "..";
import { Token } from "../../frontend/Token";

export class AssignStmt implements Stmt {

    indentNode: IndentNode;
    opToken: Token;
    expr: Expr;

    constructor(indentNode: IndentNode, opToken: Token, expr: Expr){
        this.indentNode = indentNode;
        this.opToken = opToken;
        this.expr = expr;
    }

    column(): number {
        throw this.indentNode.column();
    }

    line(): number {
        throw this.indentNode.line();
    }
}