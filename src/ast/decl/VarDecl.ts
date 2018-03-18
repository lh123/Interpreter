import { Decl, IndentNode } from "..";

export class VarDecl implements Decl {

    varNode: IndentNode;
    typeNode: IndentNode;

    constructor(varNode: IndentNode, typeNode: IndentNode) {
        this.varNode = varNode;
        this.typeNode = typeNode;
    }
    
    column(): number {
        return this.varNode.column();
    }
    
    line(): number {
        return this.varNode.line();
    }
}