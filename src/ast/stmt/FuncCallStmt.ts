import { Stmt, IndentNode } from "..";

export class FuncCallStmt implements Stmt {

    nameNode: IndentNode;
    paramList: IndentNode[];

    constructor(nameNode: IndentNode, paramList: IndentNode[]) {
        this.nameNode = nameNode;
        this.paramList = paramList;
    }

    column(): number {
        return this.nameNode.column();
    }

    line(): number {
        return this.nameNode.line();
    }
}