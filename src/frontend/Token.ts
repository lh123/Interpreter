import { TokenType } from "./TokenType";

export class Token {

    type: TokenType;
    value: any;
    line: number;
    column: number;

    constructor(type: TokenType, value: any, line: number, column: number) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

    toString() {
        return `(${this.line}:${this.column}) [${this.type.getName()}: ${this.value}]`;
    }
}