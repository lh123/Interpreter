import { SyntaxNode } from "./base/SyntaxNode";
import { Stmt } from ".";

export class Program {
    stmts: Stmt[];

    constructor(stmts: Stmt[]) {
        this.stmts = stmts;
    }
}