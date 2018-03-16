import { Statement } from "./Statement";
import { Expression, IndentifierExpression } from "../expression";

export class DeclarationStatement extends Statement {

    nameList: IndentifierExpression[];
    expressionList: Expression[];

    constructor(names: IndentifierExpression[], expressions: Expression[]) {
        super();
        this.nameList = names;
        this.expressionList = expressions;
    }
}