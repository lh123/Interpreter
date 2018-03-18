import { Decl, IndentNode, BlockStmt, VarDecl } from "..";
import { Token } from "../../frontend/Token";

export class FuncDecl implements Decl {
    
    nameNode: IndentNode;
    paramList: VarDecl[];
    body: BlockStmt;
    returnType: IndentNode;

    constructor(nameNode: IndentNode, paramList: VarDecl[], body: BlockStmt, returnType: IndentNode) {
        this.nameNode = nameNode;
        this.paramList = paramList;
        this.body = body;
        this.returnType = returnType;
    }

    column(): number {
        return this.nameNode.column();
    }

    line(): number {
        return this.nameNode.line();
    }
}