import { Decl, BlockStmt, VarDecl } from "..";
import { Token } from "../../frontend/Token";
import { TypeNode } from "../terminal/TypeNode";

export class FuncDecl implements Decl {
    
    nameToken: Token;
    paramList: VarDecl[];
    body: BlockStmt;
    returnType: TypeNode;

    constructor(nameToken: Token, paramList: VarDecl[], body: BlockStmt, returnType: TypeNode) {
        this.nameToken = nameToken;
        this.paramList = paramList;
        this.body = body;
        this.returnType = returnType;
    }

    column(): number {
        return this.nameToken.column;
    }

    line(): number {
        return this.nameToken.line;
    }
}