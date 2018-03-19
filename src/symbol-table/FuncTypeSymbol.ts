import { Symbol } from "./Symbol";
import { TypeSymbol } from "./TypeSymbol";
import { FuncDecl } from "../ast";

export class FuncTypeSymbol extends TypeSymbol {

    funcNode: FuncDecl;

    constructor(name: string, funcNode: FuncDecl) {
        super(name);
        this.funcNode = funcNode;
    }

    isFunc() {
        return true;
    }
}