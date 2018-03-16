import { SourceCode } from "./SourceCode";
import { Token, TokenType, getTokenTypeByValue } from "./Token";

const digitalMatch = /\d/;
const idMathch = /[a-zA-Z_]/;
const spaceMatch = /[ \t]/;
const operatorMatch = /(\+{1,2}|\-{1,2}|\*|\/|\={1,2}|<=?|>=?|!=?|&&?|\|\|?)/;
const delimiterMatch = /[\(\)\{\},:;]/;
const newLineMatch = /(\r\n?|\n)/;

enum State {
    Start,
    Id,
    Keyword,// if else while var for return
    Operator,// + - * / = < > <= >= == != ++ --
    Delimiter,// ( ) ; { }
    Int, Float,
    End
}

export class LexicalAnalysis {
    private sources: SourceCode;
    private state: State;
    private readBuffer: string[] = [];
    private line: number;
    private column: number;

    constructor(sources: SourceCode) {
        this.sources = sources;
        this.state = State.Start;
        this.line = 1;
        this.column = 1;
    }


    nextToken() {
        let currentChar: string;
        while (true) {
            switch (this.state) {
                case State.Start:
                    currentChar = this.sources.currentChar();
                    this.syncLineAndColumn();
                    this.clearReadBuffer();
                    if (this.sources.eof()) {
                        this.state = State.End;
                    } else if (this.isDigital(currentChar)) {
                        this.state = State.Int;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (this.isID(currentChar)) {
                        this.state = State.Id;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (this.isOperator(currentChar)) {
                        this.state = State.Operator;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (this.isDelimiter(currentChar)) {
                        this.state = State.Delimiter;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (this.isSpace(currentChar)) {
                        this.sources.nextChar();
                    } else if(this.isNewLine(currentChar)) {
                        this.sources.nextChar();
                    } else {
                        throw this.invalid(currentChar);
                    }
                    break;
                case State.Int:
                    if (this.sources.eof()) {
                        this.state = State.End;
                        return this.creatToken(TokenType.Number, parseInt(this.readBuffer.join('')));
                    } else {
                        currentChar = this.sources.currentChar();
                        if (this.isDigital(currentChar)) {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                        } else if (currentChar === '.') {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                            this.state = State.Float;
                        } else {
                            this.state = State.Start;
                            return this.creatToken(TokenType.Number, parseInt(this.readBuffer.join('')));
                        }
                    }
                    break;
                case State.Float:
                    if (this.sources.eof()) {
                        this.state = State.End;
                        return this.creatToken(TokenType.Number, parseFloat(this.readBuffer.join('')));
                    } else {
                        currentChar = this.sources.currentChar();
                        if (this.isDigital(currentChar)) {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                        } else {
                            this.state = State.Start;
                            return this.creatToken(TokenType.Number, parseFloat(this.readBuffer.join('')));
                        }
                    }
                    break;
                case State.Id:
                    if (this.sources.eof()) {
                        this.state = State.End;
                        const id = this.readBuffer.join('');
                        let type = getTokenTypeByValue(id);
                        if (type === undefined) {//id
                            return this.creatToken(TokenType.Id, id);
                        } else {
                            return this.creatToken(type, id);
                        }
                    } else {
                        currentChar = this.sources.currentChar();
                        if (this.isID(currentChar) || this.isDigital(currentChar)) {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                        } else {
                            this.state = State.Start;
                            const id = this.readBuffer.join('');
                            let type = getTokenTypeByValue(id);
                            if (type === undefined) {//id
                                return this.creatToken(TokenType.Id, id);
                            } else {
                                return this.creatToken(type, id);
                            }
                        }
                    }
                    break;
                case State.Operator:
                    currentChar = this.sources.currentChar();
                    while (!this.sources.eof() && this.isSpace(currentChar)) {
                        currentChar = this.sources.nextChar();
                    }
                    if (this.sources.eof()) {
                        this.state = State.End;
                        const op = this.readBuffer.join('');
                        let opType = getTokenTypeByValue(op);
                        if (opType !== undefined) {
                            // this.syncLineAndColumn();
                            return this.creatToken(opType, op);
                        } else {
                            throw this.invalid(op);
                        }
                    } else {
                        if (this.isOperator(currentChar)) {
                            this.state = State.Start;
                            this.readBuffer.push(currentChar);
                            let op = this.readBuffer.join('');
                            let type = getTokenTypeByValue(op);
                            if (type === undefined) {
                                this.readBuffer.pop();
                                op = this.readBuffer.join('');
                                type = getTokenTypeByValue(op);
                                if (type === undefined) {
                                    throw this.invalid(op);
                                }
                            } else {
                                this.sources.nextChar();
                            }
                            return this.creatToken(type, op);
                        } else {
                            this.state = State.Start;
                            let op = this.readBuffer.join('');
                            let type = getTokenTypeByValue(op);
                            if (type === undefined) {
                                throw this.invalid(op);
                            }
                            return this.creatToken(type, op);
                        }
                    }
                case State.Delimiter:
                    this.state = State.Start;
                    const de = this.readBuffer.join('');
                    let deType = getTokenTypeByValue(de);
                    if (deType !== undefined) {
                        return this.creatToken(deType, de);
                    } else {
                        throw this.invalid(de);
                    }
                case State.End:
                    return this.creatToken(TokenType.EOF, "<eof>");
            }
        }
    }

    private syncLineAndColumn() {
        this.line = this.sources.line;
        this.column = this.sources.column;
    }

    private clearReadBuffer() {
        this.readBuffer.splice(0, this.readBuffer.length);
    }

    private creatToken(type: TokenType, value: number | string | null) {
        return new Token(type, value, this.line, this.column);
    }

    private match(char: string) {
        const currentChar = this.sources.currentChar();
        if (currentChar !== char) {
            throw `(${this.line}:${this.column}) expect '${char}' but get '${currentChar}'`;
        }
    }

    private invalid(char: string) {
        return `(${this.line}:${this.column}) invalid char '${char}'`;
    }

    private isDigital(char: string) {
        return digitalMatch.test(char);
    }

    private isOperator(char: string) {
        return operatorMatch.test(char);
    }

    private isDelimiter(char: string) {
        return delimiterMatch.test(char);
    }

    private isID(char: string) {
        return idMathch.test(char);
    }

    private isSpace(char: string) {
        return spaceMatch.test(char);
    }

    private isNewLine(char: string) {
        return newLineMatch.test(char);
    }
}