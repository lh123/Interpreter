import { Stmt, IndentNode } from "..";
import { Token } from "../../frontend/Token";

export class IncDecStmt implements Stmt {

    indentNode: IndentNode;
    incDecToken: Token;

    constructor(indentNode: IndentNode, incDecToken: Token) {
        this.indentNode = indentNode;
        this.incDecToken = incDecToken;
    }

    column(): number {
        return this.indentNode.column();
    }

    line(): number {
        return this.indentNode.line();
    }
}