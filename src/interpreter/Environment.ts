import { SymbolTable } from "../symbol-table/SymbolTable";
import { Symbol } from "../symbol-table/Symbol";
import { Token } from "../frontend/Token";
import { TypeSymbol } from "../symbol-table/TypeSymbol";
import { VarSymbol } from "../symbol-table/VarSymbol";

export class Environment {

    private globalSymbolTable: SymbolTable;

    private currentSymbolTable: SymbolTable;

    constructor() {
        this.globalSymbolTable = new SymbolTable("global");
        this.currentSymbolTable = this.globalSymbolTable;
        this.initBuildInType();
    }

    initBuildInType() {
        this.globalSymbolTable.defineSymbol(TypeSymbol.IntegerType);
        this.globalSymbolTable.defineSymbol(TypeSymbol.RealType);
        this.globalSymbolTable.defineSymbol(TypeSymbol.BoolType);
    }

    enterScope(scopeName: string) {
        this.currentSymbolTable = new SymbolTable(scopeName, this.currentSymbolTable);
    }

    exitScope() {
        let parent = this.currentSymbolTable.getParent();
        if (parent !== null) {
            this.currentSymbolTable = parent;
        } else {
            throw "exitScop without enterScope!";
        }
    }

    defineVarSymbol(varName: string, value: any, typeName: string) {
        let typeSymbol = this.lookup(typeName);
        if (typeSymbol !== undefined) {
            if (typeSymbol instanceof TypeSymbol) {
                let symbol = new VarSymbol(varName, value, typeSymbol);
                this.currentSymbolTable.defineSymbol(symbol);
            } else {
                throw `${typeName} 不是类型`;
            }
        } else {
            throw `没有找到 ${typeName} 类型的定义`;
        }
    }

    defineTypeSymbol(typeName: string) {
        let symbol = this.lookupInCurrentScope(typeName);
        if (symbol !== undefined) {
            throw `${typeName} 重复定义`;
        }
        let typeSymbol = new TypeSymbol(typeName);
        this.currentSymbolTable.defineSymbol(typeSymbol);
    }

    getTypeSymbol(name: string, currentScope: boolean = false): TypeSymbol {
        let symbol;
        if (currentScope) {
            symbol = this.lookupInCurrentScope(name);
        } else {
            symbol = this.lookup(name);
        }
        if (symbol === undefined) {
            throw `没有找到 ${name} 类型的定义`;
        }
        if (!(symbol instanceof TypeSymbol)) {
            throw `${name} 不是类型`;
        }
        return symbol;
    }

    getVarSymbol(name: string, currentScope: boolean = false): VarSymbol {
        let symbol;
        if (currentScope) {
            symbol = this.lookupInCurrentScope(name);
        } else {
            symbol = this.lookup(name);
        }
        if (symbol === undefined) {
            throw `没有找到 "${name}" 的定义`;
        }
        if (!(symbol instanceof VarSymbol)) {
            throw `"${name}" 不是变量`;
        }
        return symbol;
    }

    lookupInCurrentScope(name: string) {
        return this.currentSymbolTable.getSymbol(name);
    }

    lookup(name: string) {
        let currentLookUp: SymbolTable | null = this.currentSymbolTable;
        let symbol: Symbol | undefined;
        while (currentLookUp !== null) {
            symbol = currentLookUp.getSymbol(name);
            if (symbol !== undefined) {
                break;
            }
            currentLookUp = currentLookUp.getParent();
        }
        return symbol;
    }
}