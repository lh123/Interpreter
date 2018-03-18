import { Decl, VarDecl } from "..";

export class CompositeVarDecl implements Decl {

    varDeclList: VarDecl[];

    constructor(varDeclList: VarDecl[]) {
        this.varDeclList = varDeclList;
    }

    column(): number {
        return this.varDeclList[0].column();
    }

    line(): number {
        return this.varDeclList[0].line();
    }
}