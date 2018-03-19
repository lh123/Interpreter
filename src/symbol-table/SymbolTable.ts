import { Symbol } from "./Symbol";
import { PredefineTokenType } from "../frontend/PredefineTokenType";
import { TypeSymbol } from "./TypeSymbol";

export class SymbolTable<T extends Symbol> {

    private name: string;
    private level: number;
    private map: Map<string, T>;

    private parent: SymbolTable<T> | null;
    
    returnValue: any;

    constructor(name: string, parent: SymbolTable<T> | null = null) {
        this.name = name;
        this.parent = parent;
        if (parent !== null) {
            this.level = parent.getLevel() + 1;
        } else {
            this.level = 0;
        }
        this.map = new Map<string, any>();
    }

    defineSymbol(symbol: T) {
        this.map.set(symbol.getName(), symbol);
    }

    getSymbol(name: string, currentScope: boolean = false): T | undefined {
        let symbol: T | undefined = this.map.get(name);
        if (symbol === undefined && currentScope === false) {
            let parent = this.getParent();
            if(parent !== null) {
                symbol = parent.getSymbol(name, currentScope);
            }
        }
        return symbol;
    }

    getLevel() {
        return this.level;
    }

    getParent() {
        return this.parent;
    }
}