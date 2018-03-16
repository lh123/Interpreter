import { Statement } from "./Statement";
import { Expression, IndentifierExpression } from "../expression";

/**
 * a = 5;
 */
export class AssignStatement extends Statement {

    variableList: IndentifierExpression[];
    expression: Expression[];

    constructor(variables: IndentifierExpression[], expressions: Expression[]) {
        super();
        this.variableList = variables;
        this.expression = expressions;
    }
}