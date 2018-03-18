import { Source } from "./Source";
import { Token } from "./Token";
import { Char } from "../utils";
import { TokenType } from "./TokenType";
import { PredefineTokenType, operatorTypeMap, delimiterTypeMap, keywordTypeMap } from "./PredefineTokenType";


enum State {
    Start,
    Indentifier,
    Keyword,// if else while var for return
    Operator,// + - * / = < > <= >= == != ++ --
    Delimiter,// ( ) ; { }
    Int, Float, String,
    End
}

export class LexicalAnalysis {
    private sources: Source;
    private state: State;
    private readBuffer: string[] = [];
    private line: number;
    private column: number;

    constructor(sources: Source) {
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
                    } else if (Char.isDigital(currentChar)) {
                        this.state = State.Int;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (Char.isIndentifier(currentChar)) {
                        this.state = State.Indentifier;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (operatorTypeMap.has(currentChar)) {
                        this.state = State.Operator;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (delimiterTypeMap.has(currentChar)) {
                        this.state = State.Delimiter;
                        this.readBuffer.push(currentChar);
                        this.sources.nextChar();
                    } else if (Char.isSpace(currentChar)) {
                        this.sources.nextChar();
                    } else if (Char.isNewLine(currentChar)) {
                        this.sources.nextChar();
                    } else {
                        this.sources.nextChar();
                        return this.creatToken(PredefineTokenType.Error, currentChar);
                    }
                    break;
                case State.Int:
                    if (this.sources.eof()) {
                        this.state = State.End;
                        return this.creatToken(PredefineTokenType.Integer, parseInt(this.readBuffer.join('')));
                    } else {
                        currentChar = this.sources.currentChar();
                        if (Char.isDigital(currentChar)) {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                        } else if (currentChar === '.') {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                            this.state = State.Float;
                        } else {
                            this.state = State.Start;
                            return this.creatToken(PredefineTokenType.Integer, parseInt(this.readBuffer.join('')));
                        }
                    }
                    break;
                case State.Float:
                    if (this.sources.eof()) {
                        this.state = State.End;
                        return this.creatToken(PredefineTokenType.Real, parseFloat(this.readBuffer.join('')));
                    } else {
                        currentChar = this.sources.currentChar();
                        if (Char.isDigital(currentChar)) {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                        } else {
                            this.state = State.Start;
                            return this.creatToken(PredefineTokenType.Real, parseFloat(this.readBuffer.join('')));
                        }
                    }
                    break;
                case State.Indentifier:
                    if (this.sources.eof()) {
                        this.state = State.End;
                        const id = this.readBuffer.join('');
                        if(id === "true" || id === "false") {
                            return this.creatToken(PredefineTokenType.Bool, id);
                        }
                        let type = keywordTypeMap.get(id);
                        if (type === undefined) {//id
                            return this.creatToken(PredefineTokenType.Indentifier, id);
                        } else {
                            return this.creatToken(type, id);
                        }
                    } else {
                        currentChar = this.sources.currentChar();
                        if (Char.isIndentifier(currentChar) || Char.isDigital(currentChar)) {
                            this.readBuffer.push(currentChar);
                            this.sources.nextChar();
                        } else {
                            this.state = State.Start;
                            const id = this.readBuffer.join('');
                            if(id === "true" || id === "false") {
                                return this.creatToken(PredefineTokenType.Bool, id);
                            }
                            let type = keywordTypeMap.get(id);
                            if (type === undefined) {//id
                                return this.creatToken(PredefineTokenType.Indentifier, id);
                            } else {
                                return this.creatToken(type, id);
                            }
                        }
                    }
                    break;
                case State.Operator:
                    currentChar = this.sources.currentChar();
                    if (this.sources.eof()) {
                        this.state = State.End;
                        const op = this.readBuffer.join('');
                        let opType = operatorTypeMap.get(op);
                        if (opType !== undefined) {
                            return this.creatToken(opType, op);
                        } else {
                            return this.creatToken(PredefineTokenType.Error, op);
                        }
                    } else {
                        this.state = State.Start;
                        if (operatorTypeMap.has(currentChar)) {
                            this.readBuffer.push(currentChar);
                            let op = this.readBuffer.join('');
                            if (operatorTypeMap.has(op)) {
                                let type = operatorTypeMap.get(op)!;
                                this.sources.nextChar();
                                return this.creatToken(type, op);
                            } else {
                                this.readBuffer.pop();
                                let op = this.readBuffer.join('');
                                let type = operatorTypeMap.get(op)!;
                                return this.creatToken(type, op);
                            }
                        } else {
                            let op = this.readBuffer.join('');
                            let type = operatorTypeMap.get(op)!;
                            return this.creatToken(type, op);
                        }
                    }
                case State.Delimiter:
                    this.state = State.Start;
                    const de = this.readBuffer.join('');
                    let deType = delimiterTypeMap.get(de)!;
                    return this.creatToken(deType, de);
                // case State.String:
                //     currentChar = this.sources.currentChar();
                //     if (currentChar === "\"") {
                //         this.state = State.Start;
                //         this.nextToken();
                //         return this.creatToken(PredefineTokenType.String, this.readBuffer.join(''));
                //     } else {
                //         this.readBuffer.push(currentChar);
                //         this.sources.nextChar();
                //     }
                //     break;
                case State.End:
                    return this.creatToken(PredefineTokenType.EOF, "<eof>");
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

    private creatToken(type: TokenType, value: any) {
        return new Token(type, value, this.line, this.column);
    }
}