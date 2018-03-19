import { Decl, Expr, VarNode, TypeNode } from "..";

export class VarDecl implements Decl {

    varNameNode: VarNode;
    varTypeNode: TypeNode;
    expr: Expr | null;

    constructor(varNameNode: VarNode, varTypeNode: TypeNode, expr: Expr | null) {
        this.varNameNode = varNameNode;
        this.varTypeNode = varTypeNode;
        this.expr = expr;
    }

    column(): number {
        return this.varNameNode.column();
    }

    line(): number {
        return this.varNameNode.line();
    }
}