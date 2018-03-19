import { Expr, BinaryExpr, UnaryExpr, FuncCallExpr, ConstNode, VarNode } from "../../ast";
import { Environment } from "../Environment";
import { PredefineTokenType } from "../../frontend/PredefineTokenType";
import { NativeFuncTypeSymbol } from "../../symbol-table/NativeFuncTypeSymbol";
import { TypeHelper } from "../../symbol-table/TypeHelper";
import { visitNativeFuncCall } from "./VisitNativeFuncCall";
import { FuncTypeSymbol } from "../../symbol-table/FuncTypeSymbol";
import { visitStmt } from "./StmtVisitor";

export function visitExpr(node: Expr, env: Environment): any {
    if (node instanceof BinaryExpr) {
        node.checkType(env);
        return visitBinaryExpr(node, env);
    } else if (node instanceof UnaryExpr) {
        return visitUaryExpr(node, env);
    } else if (node instanceof ConstNode) {
        return node.value;
    } else if (node instanceof VarNode) {
        return env.getVarSymbol(node.name).value;
    } else if (node instanceof FuncCallExpr) {
        return visitFuncCallExpr(env, node);
    }
}

function visitBinaryExpr(node: BinaryExpr, env: Environment): any {
    switch (node.op.type) {
        case PredefineTokenType.Add:
            return visitExpr(node.letftExpr, env) + visitExpr(node.rightExpr, env);
        case PredefineTokenType.Sub:
            return visitExpr(node.letftExpr, env) - visitExpr(node.rightExpr, env);
        case PredefineTokenType.Mul:
            return visitExpr(node.letftExpr, env) * visitExpr(node.rightExpr, env);
        case PredefineTokenType.Div:
            return visitExpr(node.letftExpr, env) / visitExpr(node.rightExpr, env);
        case PredefineTokenType.Equal:
            return visitExpr(node.letftExpr, env) == visitExpr(node.rightExpr, env);
        case PredefineTokenType.NotEqual:
            return visitExpr(node.letftExpr, env) != visitExpr(node.rightExpr, env);
        case PredefineTokenType.Less:
            return visitExpr(node.letftExpr, env) < visitExpr(node.rightExpr, env);
        case PredefineTokenType.LessEqual:
            return visitExpr(node.letftExpr, env) <= visitExpr(node.rightExpr, env);
        case PredefineTokenType.Greater:
            return visitExpr(node.letftExpr, env) > visitExpr(node.rightExpr, env);
        case PredefineTokenType.GreaterEqual:
            return visitExpr(node.letftExpr, env) >= visitExpr(node.rightExpr, env);
        case PredefineTokenType.And:
            return visitExpr(node.letftExpr, env) && visitExpr(node.rightExpr, env);
        case PredefineTokenType.Or:
            return visitExpr(node.letftExpr, env) || visitExpr(node.rightExpr, env);
    }
}

function visitUaryExpr(node: UnaryExpr, env: Environment): any {
    switch (node.op.type) {
        case PredefineTokenType.Add:
            return visitExpr(node.expr, env);
        case PredefineTokenType.Sub:
            return -visitExpr(node.expr, env);
        case PredefineTokenType.Not:
            return !visitExpr(node.expr, env);
    }
}

function visitFuncCallExpr(env: Environment, node: FuncCallExpr): any {
    let funcType = env.getTypeSymbol(node.nameToken.value);

    if (funcType instanceof NativeFuncTypeSymbol) {
        visitNativeFuncCall(node, funcType, env);
        return;
    }
    if (!TypeHelper.isFuncType(funcType)) {
        throw `类型 "${funcType.getName}" 不是函数类型`;
    }
    let funcNode = (funcType as FuncTypeSymbol).funcNode;
    let actualParamList = node.paramList;
    let formalParamList = funcNode.paramList;
    if (actualParamList.length !== formalParamList.length) {
        throw `函数 "${funcNode.nameToken.value}" 需要 ${formalParamList.length} 个参数`;
    }

    env.enterScope(funcNode.nameToken.value);

    //检测类型
    for (let i = 0; i < actualParamList.length; i++) {
        let aParam = actualParamList[i];
        let fParam = formalParamList[i];
        let aParamType = aParam.checkType(env);
        let fParamType = env.getTypeSymbol(fParam.varTypeNode.name);
        if (!TypeHelper.isAssignbleFrom(fParamType, aParamType)) {
            throw `不能将 "${aParamType.getName()}" 赋值给 "${fParamType.getName()}"`;
        }
    }

    //将实参的值拷贝给形参
    for (let i = 0; i < actualParamList.length; i++) {
        env.defineVarSymbol(formalParamList[i].varNameNode.name, visitExpr(actualParamList[i], env), formalParamList[i].varTypeNode.name);
    }
    visitStmt(funcNode.body, env);
    let returnValue = env.getReturn();
    env.exitScope();
    return returnValue;
}