import { Stmt, VarDecl, CompositeVarDecl, AssignStmt, BlockStmt, DoWhileStmt, WhileStmt, IfStmt } from "../../ast";
import { Environment } from "../Environment";
import { visitVarDect } from "./VarDeclVisitor";
import { visitExpr } from "./ExprVisitor";

export function visitStmt(node: Stmt, env: Environment): void {
    if (node instanceof VarDecl) {
        visitVarDect(node, env);
    } else if (node instanceof CompositeVarDecl) {
        for (let index = 0; index < node.varDeclList.length; index++) {
            const element = node.varDeclList[index];
            visitVarDect(element, env);
        }
    } else if (node instanceof AssignStmt) {
        const varNode = node.indentNode;
        let symbol = env.getVarSymbol(varNode.name);
        let varType = symbol.type;
        let exprType = node.expr.checkType(env);
        if (varType.isAssignbleFrom(exprType)) {
            symbol.value = visitExpr(node.expr, env);
        } else {
            throw `(${varNode.line()}:${varNode.column()}) ${varType.getName()} 与 ${exprType.getName()} 不能进行 "=" 运算`;
        }
    } else if (node instanceof BlockStmt) {
        for (let index = 0; index < node.stmtList.length; index++) {
            const element = node.stmtList[index];
            visitStmt(element, env);
        }
    } else if (node instanceof DoWhileStmt) {
        let testExpr = node.testExpr;
        let type = testExpr.checkType(env);
        if (!type.isBool()) {
            throw `(${testExpr.line()}:${testExpr.column()}) ${type.getName()} 不能用于 "while" 表达式`;
        }
        do {
            visitStmt(node.loopBody, env);
        } while (visitExpr(testExpr, env));
    } else if (node instanceof WhileStmt) {
        let testExpr = node.testExpr;
        let type = testExpr.checkType(env);
        if (!type.isBool()) {
            throw `(${testExpr.line()}:${testExpr.column()}) ${type.getName()} 不能用于 "while" 表达式`;
        }
        while (visitExpr(testExpr, env)) {
            visitStmt(node.loopBody, env);
        }
    } else if (node instanceof IfStmt) {
        let testExpr = node.testExpr;
        let type = testExpr.checkType(env);
        if (!type.isBool()) {
            throw `(${testExpr.line()}:${testExpr.column()}) ${type.getName()} 不能用于 "if" 表达式`;
        }
        if (visitExpr(testExpr, env)) {
            visitStmt(node.trueBlock, env);
        } else {
            if (node.falseBlock !== null) {
                visitStmt(node.falseBlock, env);
            }
        }
    }
}