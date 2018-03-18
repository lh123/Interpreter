import { IndentNode, Expr, Decl, VarDecl } from "..";

export class VarDeclDefine extends VarDecl {

    expr: Expr;

    constructor(indentNode: IndentNode, typeNode: IndentNode, expr: Expr) {
        super(indentNode, typeNode);
        this.expr = expr;
    }
}