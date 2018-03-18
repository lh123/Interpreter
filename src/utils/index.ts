
export namespace Char {

    const digitalMatch = /\d/;
    const indentifierMatch = /[a-zA-Z_]/;
    const spaceMatch = /[ \t]/;
    const newLineMatch = /(\r\n?|\n)/;

    export function isWhiteSpace(char: string) {
        return spaceMatch.test(char);
    }

    export function isDigital(char: string) {
        return digitalMatch.test(char);
    }

    export function isIndentifier(char: string) {
        return indentifierMatch.test(char);
    }

    export function isSpace(char: string) {
        return spaceMatch.test(char);
    }

    export function isNewLine(char: string) {
        return newLineMatch.test(char);
    }
}
