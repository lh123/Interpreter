import { Token } from "../../frontend/Token";
import { Expr } from "../base/Expr";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export class BadExpr implements Expr {

    checkType(): TypeSymbol {
        throw new Error("Method not implemented.");
    }

    mLine: number;
    mColumm: number;

    constructor(line: number, column: number) {
        this.mLine = line;
        this.mColumm = column;
    }

    column(): number {
        return this.mLine;
    }

    line(): number {
        return this.mColumm;
    }
}