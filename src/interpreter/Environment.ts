import { SymbolTable } from "../symbol-table/SymbolTable";
import { Symbol } from "../symbol-table/Symbol";
import { Token } from "../frontend/Token";
import { TypeSymbol } from "../symbol-table/TypeSymbol";
import { VarSymbol } from "../symbol-table/VarSymbol";
import { FuncDecl } from "../ast";
import { FuncTypeSymbol } from "../symbol-table/FuncTypeSymbol";
import { NativeFuncTypeSymbol } from "../symbol-table/NativeFuncTypeSymbol";

export class Environment {

    private globalVarSymbolTable: SymbolTable<VarSymbol>;
    private currentVarSymbolTable: SymbolTable<VarSymbol>;

    private globalTypeSymbolTable: SymbolTable<TypeSymbol>;

    constructor() {
        this.globalVarSymbolTable = new SymbolTable("global");
        this.currentVarSymbolTable = this.globalVarSymbolTable;

        this.globalTypeSymbolTable = new SymbolTable("global");

        this.initBuildInType();
    }

    initBuildInType() {
        this.globalTypeSymbolTable.defineSymbol(TypeSymbol.IntegerType);
        this.globalTypeSymbolTable.defineSymbol(TypeSymbol.RealType);
        this.globalTypeSymbolTable.defineSymbol(TypeSymbol.BoolType);

        this.globalTypeSymbolTable.defineSymbol(NativeFuncTypeSymbol.Printf);
    }

    setReturn(value: any){
        this.currentVarSymbolTable.returnValue = value;
    }

    getReturn() {
        return this.currentVarSymbolTable.returnValue;
    }

    enterScope(scopeName: string) {
        this.currentVarSymbolTable = new SymbolTable(scopeName, this.currentVarSymbolTable);
    }

    exitScope() {
        let parent = this.currentVarSymbolTable.getParent();
        if (parent !== null) {
            this.currentVarSymbolTable = parent;
        } else {
            throw "exitScop without enterScope!";
        }
    }

    defineVarSymbol(varName: string, value: any, typeName: string) {
        let varSymbol = this.currentVarSymbolTable.getSymbol(varName, true);
        if (varSymbol !== undefined) {
            throw `变量 "${varName}" 重复定义`;
        }
        let typeSymbol = this.getTypeSymbol(typeName);
        varSymbol = new VarSymbol(varName, value, typeSymbol);
        this.currentVarSymbolTable.defineSymbol(varSymbol);
    }

    defineTypeSymbol(typeName: string) {
        let typeSymbol = this.globalTypeSymbolTable.getSymbol(typeName, true);
        if (typeSymbol !== undefined) {
            throw `类型 "${typeName}" 重复定义`;
        }
        typeSymbol = new TypeSymbol(typeName);
        this.globalTypeSymbolTable.defineSymbol(typeSymbol);
    }

    defineFuncSymbol(funcName: string, node: FuncDecl) {
        let typeSymbol = this.globalTypeSymbolTable.getSymbol(funcName, true);
        if (typeSymbol !== undefined) {
            throw `类型 "${funcName}" 重复定义`;
        }
        typeSymbol = new FuncTypeSymbol(funcName, node);
        this.globalTypeSymbolTable.defineSymbol(typeSymbol);
    }

    getTypeSymbol(name: string, currentScope: boolean = false): TypeSymbol {
        let typeSymbol = this.globalTypeSymbolTable.getSymbol(name);
        if (typeSymbol === undefined) {
            throw `没有找到类型 "${name}" 的定义`;
        }
        return typeSymbol;
    }

    getVarSymbol(name: string, currentScope: boolean = false): VarSymbol {
        let varSymbol = this.currentVarSymbolTable.getSymbol(name);
        if (varSymbol === undefined) {
            throw `没有找到变量 "${name}" 类型的定义`;
        }
        return varSymbol;
    }
}