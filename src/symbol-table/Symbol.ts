export abstract class Symbol {

    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    isVariable(): boolean {
        return false;
    }

    isType(): boolean {
        return false;
    }

    isFunc(): boolean {
        return false;
    }

    isNativeFunc(): boolean {
        return false;
    }
}