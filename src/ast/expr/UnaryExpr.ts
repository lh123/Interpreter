import { Expr } from "../base/Expr";
import { Token } from "../../frontend/Token";
import { PredefineTokenType } from "../../frontend/PredefineTokenType";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class UnaryExpr implements Expr {

    op: Token;
    expr: Expr;

    constructor(op: Token, expr: Expr) {
        this.op = op;
        this.expr = expr;
    }

    checkType(env: Environment): TypeSymbol {
        let type = this.expr.checkType(env);
        if (this.op.type === PredefineTokenType.Not) {
            if (type.isBool()) {
                return type;
            } else {
                throw `"${type.getName()}" 不能进行 "${this.op.value}" 运算`;
            }
        } else if (this.op.type === PredefineTokenType.Sub || this.op.type === PredefineTokenType.Add) {
            return type;
        }
        throw `"${type.getName()}" 不能进行 "${this.op.value}" 运算`;
    }

    column(): number {
        return this.op.column;
    }

    line(): number {
        return this.op.line;
    }
}