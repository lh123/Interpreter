import { TokenType } from "./TokenType";

export const PredefineTokenType = {
    Indentifier: new TokenType("Indentifier", "<indentifier>"),

    Var: new TokenType("Var", "var"),
    Do: new TokenType("Do", "do"),
    If: new TokenType("If", "if"),
    Else: new TokenType("Else", "else"),
    While: new TokenType("While", "while"),
    For: new TokenType("For", "for"),
    Return: new TokenType("Return", "return"),
    Func: new TokenType("Func", "function"),

    Integer: new TokenType("Integer", "int"),
    Real: new TokenType("Real", "real"),
    String: new TokenType("String", "string"),
    Bool: new TokenType("Bool", "bool"),

    And: new TokenType("And", "&&"),
    Or: new TokenType("Or", "||"),
    Not: new TokenType("Not", "!"),
    Assign: new TokenType("Assign", "="),
    Add: new TokenType("Add", "+"),
    Sub: new TokenType("Sub", "-"),
    Mul: new TokenType("Mul", "*"),
    Div: new TokenType("Div", "/"),
    INC: new TokenType("INC", "++"),
    DEC: new TokenType("DEC", "--"),
    Equal: new TokenType("Equal", "=="),
    NotEqual: new TokenType("NotEqual", "!="),
    Less: new TokenType("Less", "<"),
    LessEqual: new TokenType("LessEqual", "<="),
    Greater: new TokenType("Greater", ">"),
    GreaterEqual: new TokenType("GreaterEqual", ">="),

    LeftParen: new TokenType("LeftParen", "("),
    RightParen: new TokenType("RightParen", ")"),
    LeftBrace: new TokenType("LeftBrace", "{"),
    RightBrace: new TokenType("RightBrace", "}"),
    Semicolon: new TokenType("Semicolon", ";"),
    Comma: new TokenType("Comma", ","),
    Colon: new TokenType("Colon", ":"),
    Quote: new TokenType("Quote", "\""),

    EOF: new TokenType("EOF", "<eof>"),
    Error: new TokenType("Error", "<error>")
}

export const keywordTypeMap = new Map<string, TokenType>([
    [PredefineTokenType.Var.getText(), PredefineTokenType.Var],
    [PredefineTokenType.Do.getText(), PredefineTokenType.Do],
    [PredefineTokenType.If.getText(), PredefineTokenType.If],
    [PredefineTokenType.Else.getText(), PredefineTokenType.Else],
    [PredefineTokenType.While.getText(), PredefineTokenType.While],
    [PredefineTokenType.For.getText(), PredefineTokenType.For],
    [PredefineTokenType.Return.getText(), PredefineTokenType.Return],
    [PredefineTokenType.Func.getText(), PredefineTokenType.Func]
]);

export const operatorTypeMap = new Map<string, TokenType>([
    [PredefineTokenType.And.getText(), PredefineTokenType.And],
    [PredefineTokenType.Or.getText(), PredefineTokenType.Or],
    [PredefineTokenType.Not.getText(), PredefineTokenType.Not],
    [PredefineTokenType.Assign.getText(), PredefineTokenType.Assign],
    [PredefineTokenType.Add.getText(), PredefineTokenType.Add],
    [PredefineTokenType.Sub.getText(), PredefineTokenType.Sub],
    [PredefineTokenType.Mul.getText(), PredefineTokenType.Mul],
    [PredefineTokenType.Div.getText(), PredefineTokenType.Div],
    [PredefineTokenType.INC.getText(), PredefineTokenType.INC],
    [PredefineTokenType.DEC.getText(), PredefineTokenType.DEC],
    [PredefineTokenType.Equal.getText(), PredefineTokenType.Equal],
    [PredefineTokenType.NotEqual.getText(), PredefineTokenType.NotEqual],
    [PredefineTokenType.Less.getText(), PredefineTokenType.Less],
    [PredefineTokenType.LessEqual.getText(), PredefineTokenType.LessEqual],
    [PredefineTokenType.Greater.getText(), PredefineTokenType.Greater],
    [PredefineTokenType.GreaterEqual.getText(), PredefineTokenType.GreaterEqual],
]);

export const delimiterTypeMap = new Map<string, TokenType>([
    [PredefineTokenType.LeftParen.getText(), PredefineTokenType.LeftParen],
    [PredefineTokenType.RightParen.getText(), PredefineTokenType.RightParen],
    [PredefineTokenType.LeftBrace.getText(), PredefineTokenType.LeftBrace],
    [PredefineTokenType.RightBrace.getText(), PredefineTokenType.RightBrace],
    [PredefineTokenType.Semicolon.getText(), PredefineTokenType.Semicolon],
    [PredefineTokenType.Comma.getText(), PredefineTokenType.Comma],
    [PredefineTokenType.Colon.getText(), PredefineTokenType.Colon],
    [PredefineTokenType.Quote.getText(), PredefineTokenType.Quote]
]);
