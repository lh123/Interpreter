import { Expression, IndentifierExpression } from ".";

export class MethodCallExpression extends Expression {

    id: IndentifierExpression;
    expressionList: Expression[];

    constructor(id: IndentifierExpression, elist: Expression[]) {
        super();
        this.id = id;
        this.expressionList = elist;
    }

}