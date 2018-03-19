import { Stmt, VarDecl, AssignStmt, BlockStmt, DoWhileStmt, WhileStmt, IfStmt, FuncDecl, ReturnStmt, ExprStmt } from "../../ast";
import { Environment } from "../Environment";
import { visitVarDecl } from "./VarDeclVisitor";
import { visitExpr } from "./ExprVisitor";
import { TypeHelper } from "../../symbol-table/TypeHelper";
import { FuncTypeSymbol } from "../../symbol-table/FuncTypeSymbol";
import { NativeFuncTypeSymbol } from "../../symbol-table/NativeFuncTypeSymbol";
import { visitNativeFuncCall } from "./VisitNativeFuncCall";
import { FuncCallExpr } from "../../ast/expr/FuncCallExpr";

export function visitStmt(node: Stmt, env: Environment): void {
    if (node instanceof VarDecl) {
        visitVarDecl(node, env);
    } else if (node instanceof AssignStmt) {
        visitAssignStmt(node, env);
    } else if (node instanceof BlockStmt) {
        visitBlockStmt(node, env);
    } else if (node instanceof DoWhileStmt) {
        visitDoWhileStmt(node, env);
    } else if (node instanceof WhileStmt) {
        visitWhileStmt(node, env);
    } else if (node instanceof IfStmt) {
        visitIfStmt(node, env);
    } else if (node instanceof FuncDecl) {
        visitFuncDeclStmt(node, env);
    } else if (node instanceof ReturnStmt) {
        visitReturnStmt(node, env);
    } else if (node instanceof ExprStmt) {
        visitExprStmt(node, env);
    }
}

function visitExprStmt(node: ExprStmt, env: Environment) {
    let expr = node.exp;
    let value = visitExpr(expr, env);
}

function visitReturnStmt(node: ReturnStmt, env: Environment) {
    let expr = node.expr;
    if (expr !== null) {
        let type = expr.checkType(env);
        let value = visitExpr(expr, env);
        env.setReturn(value);        
    }
}

function visitFuncDeclStmt(node: FuncDecl, env: Environment) {
    let funcName = node.nameToken.value;
    env.defineFuncSymbol(funcName, node);
}

function visitIfStmt(node: IfStmt, env: Environment) {
    let testExpr = node.testExpr;
    let type = testExpr.checkType(env);
    if (!TypeHelper.isBoolType(type)) {
        throw `(${testExpr.line()}:${testExpr.column()}) ${type.getName()} 不能用于 "if" 表达式`;
    }
    if (visitExpr(testExpr, env)) {
        visitStmt(node.trueBlock, env);
    }
    else {
        if (node.falseBlock !== null) {
            visitStmt(node.falseBlock, env);
        }
    }
}

function visitWhileStmt(node: WhileStmt, env: Environment) {
    let testExpr = node.testExpr;
    let type = testExpr.checkType(env);
    if (!TypeHelper.isBoolType(type)) {
        throw `(${testExpr.line()}:${testExpr.column()}) ${type.getName()} 不能用于 "while" 表达式`;
    }
    while (true) {
        if (visitExpr(testExpr, env)) {
            visitStmt(node.loopBody, env);
        } else {
            break;
        }
    }
}

function visitDoWhileStmt(node: DoWhileStmt, env: Environment) {
    let testExpr = node.testExpr;
    let type = testExpr.checkType(env);
    if (!TypeHelper.isBoolType(type)) {
        throw `(${testExpr.line()}:${testExpr.column()}) ${type.getName()} 不能用于 "while" 表达式`;
    }
    while (true) {
        visitStmt(node.loopBody, env);
        if (!visitExpr(testExpr, env)) {
            break;
        }
    }
}

function visitBlockStmt(node: BlockStmt, env: Environment) {
    for (let index = 0; index < node.stmtList.length; index++) {
        const element = node.stmtList[index];
        visitStmt(element, env);
    }
}

function visitAssignStmt(node: AssignStmt, env: Environment) {
    const varNode = node.varNode;
    let symbol = env.getVarSymbol(varNode.name);
    let varType = symbol.type;
    let exprType = node.expr.checkType(env);
    if (TypeHelper.isAssignbleFrom(varType, exprType)) {
        symbol.value = visitExpr(node.expr, env);
    }
    else {
        throw `(${varNode.line()}:${varNode.column()}) ${varType.getName()} 与 ${exprType.getName()} 不能进行 "=" 运算`;
    }
}