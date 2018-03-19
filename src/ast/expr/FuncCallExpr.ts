import { Stmt, Expr } from "..";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";
import { FuncTypeSymbol } from "../../symbol-table/FuncTypeSymbol";
import { Token } from "../../frontend/Token";

export class FuncCallExpr implements Expr {

    nameToken: Token;
    paramList: Expr[];

    constructor(nameToken: Token, paramList: Expr[]) {
        this.nameToken = nameToken;
        this.paramList = paramList;
    }

    checkType(env: Environment): TypeSymbol {
        let symbol = env.getTypeSymbol(this.nameToken.value);
        if (symbol.isFunc()) {
            if(symbol.isNativeFunc()) {
                return symbol;
            }
            let node = (symbol as FuncTypeSymbol).funcNode;
            let returnType = node.returnType;
            let type = env.getTypeSymbol(returnType.name);
            return type;
        }
        throw `没有找到 "${this.nameToken.value}" 的定义`;
    }

    column(): number {
        return this.nameToken.column;
    }

    line(): number {
        return this.nameToken.line;
    }
}