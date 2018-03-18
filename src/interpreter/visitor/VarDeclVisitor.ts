import { VarDecl, VarDeclDefine } from "../../ast";
import { Environment } from "../Environment";
import { visitExpr } from "./ExprVisitor";


export function visitVarDect(node: VarDecl, env: Environment): void {
    let varNode = node.varNode;
    let typeNode = node.typeNode;
    let typeSymbol = env.getTypeSymbol(typeNode.name);
    if (node instanceof VarDeclDefine) {
        let expr = node.expr;
        let exprType = expr.checkType(env);
        if (typeSymbol.isAssignbleFrom(exprType)) {
            env.defineVarSymbol(varNode.name, visitExpr(expr, env), typeSymbol.name);
        } else {
            throw `"${typeSymbol.getName()}" 与 "${exprType.getName()}" 不能进行 "=" 运算`;
        }
    } else {
        if (typeSymbol.isBool()) {
            env.defineVarSymbol(varNode.name, false, typeSymbol.name);
        } else if (typeSymbol.isInteger()) {
            env.defineVarSymbol(varNode.name, 0, typeSymbol.name);
        } else if (typeSymbol.isReal()) {
            env.defineVarSymbol(varNode.name, 0.0, typeSymbol.name);
        } else {
            throw "never reach here!";
        }
    }
}