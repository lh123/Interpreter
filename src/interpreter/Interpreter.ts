import * as Ast from "../ast";
import { Environment } from "./Environment";
import { Parser } from "../frontend/Parser";
import { visitVarDecl } from "./visitor/VarDeclVisitor";
import { visitStmt } from "./visitor/StmtVisitor";

export class Interpreter {

    private parser: Parser;
    private env: Environment;

    constructor(parser: Parser, env: Environment) {
        this.parser = parser;
        this.env = env;
    }

    run() {
        let program = this.parser.parser();
        for (let index = 0; index < program.stmts.length; index++) {
            const stmts = program.stmts[index];
            visitStmt(stmts, this.env);
        }
    }
}