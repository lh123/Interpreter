export enum TokenType {
    And, Or, Not,
    Var, Do, If, Else, False,
    True, While, For, Return,
    Id, Number,
    Assign, Add, Sub, Mul, Div,
    SelfAdd, SelfSub,
    LeftParen, RightParen,
    LeftBrace, RightBrace,
    Semicolon, Comma,
    Equal, NotEqual,
    Less, LessEqual,
    Greater, GreaterEqual,
    EOF
}

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

    }
}

export const resolveTokenMap: Map<TokenType, string> = new Map([
    [TokenType.And, "&&"], [TokenType.Or, "||"], [TokenType.Not, "!"],
    [TokenType.Var, "var"], [TokenType.Do, "do"], [TokenType.If, "if"], [TokenType.Else, "else"], [TokenType.False, "false"],
    [TokenType.True, "true"], [TokenType.While, "while"], [TokenType.For, "for"], [TokenType.Return, "return"],
    [TokenType.Assign, "="], [TokenType.Add, "+"], [TokenType.Sub, "-"], [TokenType.Mul, "*"], [TokenType.Div, "/"],
    [TokenType.SelfAdd, "++"], [TokenType.SelfSub, "--"],
    [TokenType.LeftParen, "("], [TokenType.RightParen, ")"],
    [TokenType.LeftBrace, "{"], [TokenType.RightBrace, "}"],
    [TokenType.Semicolon, ";"], [TokenType.Comma, ","],
    [TokenType.Equal, "=="], [TokenType.NotEqual, "!="],
    [TokenType.Less, "<"], [TokenType.LessEqual, "<="],
    [TokenType.Greater, ">"], [TokenType.GreaterEqual, ">="],
]);

export function getTokenValueByType(type: TokenType) {
    return resolveTokenMap.get(type);
}

export function getTokenTypeByValue(value: string) {
    for (let e of resolveTokenMap) {
        if (e[1] === value) {
            return e[0];
        }
    }
}