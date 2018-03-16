
export class SourceCode {
    private sources: string;
    line: number;
    column: number;

    private index: number;

    constructor(text: string) {
        this.sources = text;
        this.index = 0;

        this.line = 1;
        this.column = 1;
    }

    currentIndex() {
        return this.index;
    }

    currentChar() {
        return this.sources[this.index];
    }

    nextChar(): string {
        this.index++;
        this.column ++;
        const char = this.sources[this.index];
        if(char === '\n') {
            this.column = 0;
            this.line ++;
        }
        return char;
    }

    peekChar(i: number = 1) {
        return this.sources[this.index + i];
    }

    hasNextChar() {
        return this.index < this.sources.length - 1;
    }

    eof() {
        return this.index >= this.sources.length;
    }
}