import { Expression } from "./Expression";
import { Token } from "../../analysis/Token";

/**
 * 变量引用
 * "a"
 */
export class IndentifierExpression extends Expression {

    token: Token;
    value: string;

    constructor(token: Token) {
        super();
        this.token = token;
        this.value = token.value;
    }

}