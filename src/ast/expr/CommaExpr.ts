import { Expr } from "../base/Expr";
import { SyntaxNode } from "..";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class CommaExpr implements Expr {

    exprList: Expr[];

    constructor(expreList: Expr[]) {
        this.exprList = expreList;
    }

    checkType(env: Environment): TypeSymbol {
        return this.exprList[this.exprList.length - 1].checkType(env);
    }

    column(): number {
        throw this.exprList[0].column();
    }

    line(): number {
        throw this.exprList[0].line();
    }
}