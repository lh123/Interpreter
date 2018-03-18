import { Expr, BinaryExpr, UnaryExpr, CommaExpr, IndentNode, IntNode, RealNode, BoolNode } from "../../ast";
import { Environment } from "../Environment";
import { PredefineTokenType } from "../../frontend/PredefineTokenType";

export function visitExpr(node: Expr, env: Environment): any {
    if (node instanceof BinaryExpr) {
        node.checkType(env);
        return visitBinaryExpr(node, env);
    } else if (node instanceof UnaryExpr) {
        return visitUaryExpr(node, env);
    } else if (node instanceof CommaExpr) {
        return visitCommaExpr(node, env);
    } else if (node instanceof IndentNode) {
        return env.getVarSymbol(node.name).value;
    } else if (node instanceof IntNode) {
        return node.value;
    } else if (node instanceof RealNode) {
        return node.value;
    } else if (node instanceof BoolNode) {
        return node.value;
    } else {
        throw `未知表达式`;
    }
}

function visitBinaryExpr(node: BinaryExpr, env: Environment): any {
    let lvalue = visitExpr(node.letftExpr, env);
    let rvalue = visitExpr(node.rightExpr, env);
    switch (node.op.type) {
        case PredefineTokenType.Add:
            return lvalue + rvalue;
        case PredefineTokenType.Sub:
            return lvalue - rvalue;
        case PredefineTokenType.Mul:
            return lvalue * rvalue;
        case PredefineTokenType.Div:
            return lvalue / rvalue;
        case PredefineTokenType.Equal:
            return lvalue === rvalue;
        case PredefineTokenType.NotEqual:
            return lvalue !== rvalue;
        case PredefineTokenType.Less:
            return lvalue < rvalue;
        case PredefineTokenType.LessEqual:
            return lvalue <= rvalue;
        case PredefineTokenType.Greater:
            return lvalue > rvalue;
        case PredefineTokenType.GreaterEqual:
            return lvalue >= rvalue;
        case PredefineTokenType.And:
            return lvalue && rvalue;
        case PredefineTokenType.Or:
            return lvalue || rvalue;
    }
    throw `未知运算符${node.op.value}`;
}

function visitUaryExpr(node: UnaryExpr, env: Environment): any {
    let lvalue = visitExpr(node.expr, env);
    switch (node.op.type) {
        case PredefineTokenType.Add:
            return lvalue;
        case PredefineTokenType.Sub:
            return -lvalue;
        case PredefineTokenType.Not:
            return !lvalue;
    }
    throw `未知运算符${node.op.value}`;
}

function visitCommaExpr(node: CommaExpr, env: Environment): number | boolean {
    let lastValue: number | boolean = 0;
    for (let index = 0; index < node.exprList.length; index++) {
        const element = node.exprList[index];
        lastValue = visitExpr(element, env);
    }
    return lastValue;
}