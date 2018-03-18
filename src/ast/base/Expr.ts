import { SyntaxNode } from "./SyntaxNode";
import { Environment } from "../../interpreter/Environment";
import { TypeSymbol } from "../../symbol-table/TypeSymbol";

export interface Expr extends SyntaxNode {
    checkType(env: Environment): TypeSymbol;
}