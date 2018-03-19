import { VarDecl } from "../../ast";
import { Environment } from "../Environment";
import { visitExpr } from "./ExprVisitor";
import { TypeHelper } from "../../symbol-table/TypeHelper";


export function visitVarDecl(node: VarDecl, env: Environment): void {
    let varNode = node.varNameNode;
    let typeNode = node.varTypeNode;
    let varType = env.getTypeSymbol(typeNode.name);
    if (node.expr !== null) {
        let expr = node.expr;
        let exprType = expr.checkType(env);
        if (TypeHelper.isAssignbleFrom(varType, exprType)) {
            env.defineVarSymbol(varNode.name, visitExpr(expr, env), varType.getName());
        } else {
            throw `"${varType.getName()}" 与 "${exprType.getName()}" 不能进行 "=" 运算`;
        }
    } else {
        if (TypeHelper.isBoolType(varType)) {
            env.defineVarSymbol(varNode.name, false, varType.getName());
        } else if (TypeHelper.isIntegerType(varType)) {
            env.defineVarSymbol(varNode.name, 0, varType.getName());
        } else if (TypeHelper.isRealType(varType)) {
            env.defineVarSymbol(varNode.name, 0.0, varType.getName());
        } else {
            throw "never reach here!";
        }
    }
}