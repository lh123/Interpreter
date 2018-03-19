import { Expr } from "../base/Expr";
import { Token } from "../../frontend/Token";
import { SyntaxNode } from "..";
import { PredefineTokenType } from "../../frontend/PredefineTokenType";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";
import { TypeHelper } from "../../symbol-table/TypeHelper";

export class BinaryExpr implements Expr {

    op: Token;
    letftExpr: Expr;
    rightExpr: Expr;
    type: TypeSymbol | null;

    constructor(op: Token, leftExpr: Expr, rightExpr: Expr) {
        this.op = op;
        this.letftExpr = leftExpr;
        this.rightExpr = rightExpr;
        this.type = null;
    }

    checkType(env: Environment): TypeSymbol {
        if (this.type !== null) {
            return this.type;
        }
        let leftType = this.letftExpr.checkType(env);
        let rightType = this.rightExpr.checkType(env);
        switch (this.op.type) {
            case PredefineTokenType.Add:
            case PredefineTokenType.Sub:
            case PredefineTokenType.Mul:
            case PredefineTokenType.Div:
                if (TypeHelper.isRealType(leftType) || TypeHelper.isRealType(rightType)) {
                    this.type = TypeSymbol.RealType;
                    return this.type;
                } else if (TypeHelper.isBoolType(leftType) || TypeHelper.isBoolType(rightType)) {
                    throw `"${leftType.getName()}" 与 "${rightType.getName()}" 不能进行 "${this.op.value}" 运算`;
                } else {
                    this.type = TypeSymbol.IntegerType;
                    return this.type;
                }
            case PredefineTokenType.And:
            case PredefineTokenType.Or:
                if (TypeHelper.isBoolType(leftType) && TypeHelper.isBoolType(rightType)) {
                    this.type = TypeSymbol.BoolType;
                    return this.type;
                } else {
                    throw `"${leftType.getName()}" 与 "${rightType.getName()}" 不能进行 "${this.op.value}" 运算`;
                }
            case PredefineTokenType.Equal:
            case PredefineTokenType.NotEqual:
                if (!TypeHelper.isSameType(leftType, rightType)) {
                    throw `"${leftType.getName()}" 与 "${rightType.getName()}" 不能进行 "${this.op.value}" 运算`;
                }
                this.type = TypeSymbol.BoolType;
                return this.type;
            case PredefineTokenType.Less:
            case PredefineTokenType.LessEqual:
            case PredefineTokenType.Greater:
            case PredefineTokenType.GreaterEqual:
                if (TypeHelper.isCompareble(leftType, rightType)) {
                    throw `"${leftType.getName()}" 与 "${rightType.getName()}" 不能进行 "${this.op.value}" 运算`;
                }
                this.type = TypeSymbol.BoolType;
                return this.type;
        }
        throw `"${leftType.getName()}" 与 "${rightType.getName()}" 不能进行 "${this.op.value}" 运算`;
    }

    column(): number {
        return this.letftExpr.column();
    }

    line(): number {
        return this.letftExpr.line();
    }
}