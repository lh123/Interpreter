
export class TokenType {

    private name: string;
    private text: string;

    constructor(name: string, text: string) {
        this.name = name;
        this.text = text;
    }

    getName(): string {
        return this.name;
    }

    getText(): string {
        return this.text;
    }

    toString(): string {
        if (this.text === undefined) {
            return `(${this.name})`;
        } else {
            return `(${this.name} : ${this.text})`;
        }
    }
}