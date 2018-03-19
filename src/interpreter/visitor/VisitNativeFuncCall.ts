import { Environment } from "../Environment";
import { NativeFuncTypeSymbol } from "../../symbol-table/NativeFuncTypeSymbol";
import { visitExpr } from "./ExprVisitor";
import { FuncCallExpr } from "../../ast";

export function visitNativeFuncCall(node: FuncCallExpr, funcType: NativeFuncTypeSymbol, env: Environment) {
    let value;
    for(let expr of node.paramList) {
        value = visitExpr(expr, env);
    }
    if(funcType === NativeFuncTypeSymbol.Printf){
        console.log(value);
    }
}