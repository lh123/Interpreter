import { Symbol } from "./Symbol";
import { PredefineTokenType } from "../frontend/PredefineTokenType";
import { TypeSymbol } from "./TypeSymbol";

export class SymbolTable {

    private name: string;
    private level: number;
    private map: Map<string, Symbol>;

    private parent: SymbolTable | null;

    constructor(name: string, parent: SymbolTable | null = null) {
        this.name = name;
        this.parent = parent;
        if (parent !== null) {
            this.level = parent.getLevel() + 1;
        } else {
            this.level = 0;
        }
        this.map = new Map<string, any>();
    }

    defineSymbol(symbol: Symbol) {
        this.map.set(symbol.name, symbol);
    }

    getSymbol(name: string) {
        let symbol = this.map.get(name);
        return symbol;
    }

    getLevel() {
        return this.level;
    }

    getParent() {
        return this.parent;
    }
}