import { Stmt, VarNode } from "..";
import { Token } from "../../frontend/Token";

export class IncDecStmt implements Stmt {

    varNode: VarNode;
    incDecToken: Token;

    constructor(indentNode: VarNode, incDecToken: Token) {
        this.varNode = indentNode;
        this.incDecToken = incDecToken;
    }

    column(): number {
        return this.varNode.column();
    }

    line(): number {
        return this.varNode.line();
    }
}