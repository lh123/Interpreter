import { LexicalAnalysis } from "./LexicalAnalysis";
import { Token } from "./Token";
import { PredefineTokenType } from "./PredefineTokenType";
import { TokenType } from "./TokenType";

import * as Ast from "../ast";
import { BlockStmt, AssignStmt, IncDecStmt, VarDecl, Expr } from "../ast";
import { TypeSymbol } from "../symbol-table/TypeSymbol";

export class Parser {


    private lexicalAnalysis: LexicalAnalysis;
    private mCurrentToken: Token | null = null;
    private mNextToken: Token | null = null;

    constructor(lexicalAnalysis: LexicalAnalysis) {
        this.lexicalAnalysis = lexicalAnalysis;
    }

    parser(): Ast.Program {
        let token = this.currentToken();
        let Stmts: Ast.Stmt[] = [];
        while (token.type !== PredefineTokenType.EOF) {
            let Stmt = this.parserStmt();
            if (Stmt !== null) {
                Stmts.push(Stmt);
            }
            token = this.currentToken();
        }
        return new Ast.Program(Stmts);
    }

    /**
     * Block := "{" (Stmt)* "}";
     */
    private parserBlockStmt(): Ast.BlockStmt {
        let StmtList: Ast.Stmt[] = [];
        let leftBrace = this.currentToken();
        this.match(PredefineTokenType.LeftBrace);
        let token = this.currentToken();
        while (token.type !== PredefineTokenType.RightBrace) {
            let Stmt = this.parserStmt();
            if (Stmt) {
                StmtList.push(Stmt);
            }
            token = this.currentToken();
        }
        let rightBrace = this.currentToken();
        this.match(PredefineTokenType.RightBrace);
        return new Ast.BlockStmt(leftBrace, StmtList, rightBrace);
    }

    /**
     * Statement := VarDecalration
     *           |  FuncDeclartion
     *           |  VarAssignStmt
     *           |  IfStmt
     *           |  DoWhileStmt
     *           |  WhileStmt
     *           |  ReturnStmt
     *           |  Block
     *           |  ExprStmt
     */
    private parserStmt(): Ast.Stmt | null {
        let token = this.currentToken();
        if (token.type === PredefineTokenType.Semicolon) {
            this.nextToken();
            return null;
        } else if (token.type === PredefineTokenType.Do) {
            return this.parserDoWhileStmt();
        } else if (token.type === PredefineTokenType.While) {
            return this.parserWhileStmt();
        } else if (token.type === PredefineTokenType.If) {
            return this.parserIfStmt();
        } else if (token.type === PredefineTokenType.Var) {
            return this.parserVarDeclaration();
        } else if (token.type === PredefineTokenType.Func) {
            return this.parserFuncDecl();
        } else if (token.type === PredefineTokenType.Return) {
            return this.parserReturnStmt();
        } else if (token.type === PredefineTokenType.Indentifier) {
            let nextToken = this.peekToken();
            if (nextToken.type === PredefineTokenType.Assign) {
                return this.parserVarAssignStmt();
            } else {
                return this.parserExprStmt();
            }
        } else if (token.type === PredefineTokenType.LeftBrace) {
            return this.parserBlockStmt();
        } else {
            throw this.invalid(token);
        }
    }

    // function add(a: int, b: int): int {
    //     return a + b;
    // }
    /**
     * FuncDeclartion := "function" <id> "(" (<id> ":" <id> ("," <id> ":" <id>)*)? ")" ":" <id> BlockStmt
     */
    private parserFuncDecl(): Ast.FuncDecl {
        this.match(PredefineTokenType.Func);
        let funcNameToken = this.match(PredefineTokenType.Indentifier);
        let funcParamList: Ast.VarDecl[] = [];
        this.match(PredefineTokenType.LeftParen);
        let token = this.currentToken();
        if (token.type === PredefineTokenType.Indentifier) {
            let paramToken = this.nextToken();
            let paramNode = new Ast.VarNode(token);
            this.match(PredefineTokenType.Colon);
            let paramTypeToken = this.match(PredefineTokenType.Indentifier);
            let paramTypeNode = new Ast.TypeNode(paramTypeToken);
            funcParamList.push(new Ast.VarDecl(paramNode, paramTypeNode, null));
            token = this.currentToken();
            while (token.type === PredefineTokenType.Comma) {
                this.nextToken();
                paramToken = this.match(PredefineTokenType.Indentifier);
                paramNode = new Ast.VarNode(paramToken);
                this.match(PredefineTokenType.Colon);
                paramTypeToken = this.match(PredefineTokenType.Indentifier);
                paramTypeNode = new Ast.TypeNode(paramTypeToken);
                funcParamList.push(new Ast.VarDecl(paramNode, paramTypeNode, null));
                token = this.currentToken();
            }
        }
        this.match(PredefineTokenType.RightParen);
        this.match(PredefineTokenType.Colon);
        let returnToken = this.match(PredefineTokenType.Indentifier);
        let returnType = new Ast.TypeNode(returnToken);
        let funcBody = this.parserBlockStmt();
        return new Ast.FuncDecl(funcNameToken, funcParamList, funcBody, returnType);
    }

    /**
     * ReturnStmt := "return" (Expr)? ";"
     */
    private parserReturnStmt(): Ast.ReturnStmt {
        let returnToken = this.match(PredefineTokenType.Return);
        let returnExpr: Expr | null = null;
        if (this.currentToken().type !== PredefineTokenType.Semicolon) {
            returnExpr = this.parserExpression();
        }
        this.match(PredefineTokenType.Semicolon);
        return new Ast.ReturnStmt(returnExpr, returnToken);
    }

    /**
     * such as : var a: int = 5;
     * 
     * VarDeclaration := "var" <id> ":" <id> ("=" Exp) ";"
     */
    private parserVarDeclaration(): Ast.Stmt {
        let varToken = this.match(PredefineTokenType.Var);
        let varNameToken = this.match(PredefineTokenType.Indentifier);
        this.match(PredefineTokenType.Colon);
        let varTypeToken = this.match(PredefineTokenType.Indentifier);
        let token = this.currentToken();
        let expr: Ast.Expr | null = null;
        if (token.type === PredefineTokenType.Assign) {
            this.nextToken();
            expr = this.parserExpression();
        }
        this.match(PredefineTokenType.Semicolon);
        return new Ast.VarDecl(new Ast.VarNode(varNameToken), new Ast.TypeNode(varTypeToken), expr);
    }

    /**
     * such as a = 4 + 5;
     * VarAssignStmt := <id> "=" Expression ";"
     *               |  <id> ("++"|"--") ";"
     */
    private parserVarAssignStmt(): Ast.Stmt {
        let varToken = this.match(PredefineTokenType.Indentifier);
        let indentNode = new Ast.VarNode(varToken);
        let stmt: AssignStmt | IncDecStmt;
        let opToken = this.currentToken();
        if (opToken.type === PredefineTokenType.Assign) {
            this.nextToken();
            let expr = this.parserExpression();
            stmt = new Ast.AssignStmt(indentNode, opToken, expr);
        } else if (opToken.type === PredefineTokenType.INC || opToken.type === PredefineTokenType.DEC) {
            this.nextToken();
            stmt = new Ast.IncDecStmt(indentNode, opToken);
        } else {
            throw this.invalid(opToken);
        }
        this.match(PredefineTokenType.Semicolon);
        return stmt;
    }

    /** 
     * WhileStmt := "while" "(" Expression ")"
     *                      Block
     *                |  "while" "(" Expression ")" ";"
     */
    private parserWhileStmt(): Ast.WhileStmt {
        let whileToken = this.match(PredefineTokenType.While);
        this.match(PredefineTokenType.LeftParen);
        let exp = this.parserExpression();
        this.match(PredefineTokenType.RightParen);
        let token = this.currentToken();
        let loopBody: Ast.BlockStmt | Ast.EmptyStmt;
        if (token.type === PredefineTokenType.LeftBrace) {
            loopBody = this.parserBlockStmt();
        } else {
            let semiToken = this.match(PredefineTokenType.Semicolon);
            loopBody = new Ast.EmptyStmt(semiToken.line, semiToken.column);
        }
        return new Ast.WhileStmt(whileToken, exp, loopBody);
    }

    /* 
    * DoWhileStmt := "do" 
    *                      Block 
    *                "while" "(" Expression ")" ";""
    */
    private parserDoWhileStmt(): Ast.DoWhileStmt {
        let doToken = this.match(PredefineTokenType.Do);
        let loopBody = this.parserBlockStmt();
        this.match(PredefineTokenType.While);
        this.match(PredefineTokenType.LeftParen);
        let testExpr = this.parserExpression();
        this.match(PredefineTokenType.RightParen);
        this.match(PredefineTokenType.Semicolon);
        return new Ast.DoWhileStmt(doToken, loopBody, testExpr);
    }

    /**
     * IfStmt := "if" "(" Expression ")" BlockStmt
     *           ("else" BlockStmt)?
     */
    private parserIfStmt(): Ast.IfStmt {
        let ifToken = this.match(PredefineTokenType.If);
        this.match(PredefineTokenType.LeftParen);
        let testExpr = this.parserExpression();
        this.match(PredefineTokenType.RightParen);
        let trueBlock = this.parserBlockStmt();
        let falseBlock: BlockStmt | null;
        let token = this.currentToken();
        if (token.type === PredefineTokenType.Else) {
            this.nextToken();
            falseBlock = this.parserBlockStmt();
        } else {
            falseBlock = null;
        }
        return new Ast.IfStmt(ifToken, testExpr, trueBlock, falseBlock);
    }

    parserExprStmt(): Ast.ExprStmt {
        let expr = this.parserExpression();
        this.match(PredefineTokenType.Semicolon);
        return new Ast.ExprStmt(expr);
    }

    /**
     * Expression := LogicalOrExpression
     */
    parserExpression(): Ast.Expr {
        let logical = this.parserLogicalOrExpression();
        return logical;
    }

    /**
     * LogicalOrExpression := LogicalAndExpression ("||" LogicalAndExpression)*
     */
    parserLogicalOrExpression(): Ast.Expr {
        let left = this.parserLogicalAndExpression();
        let token = this.currentToken();
        while (token.type === PredefineTokenType.Or) {
            this.nextToken();
            let right = this.parserLogicalAndExpression();
            left = new Ast.BinaryExpr(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * LogicalAndExpression := EqualExpression ("&&" EqualExpression)*
     */
    parserLogicalAndExpression(): Ast.Expr {
        let left = this.parserEqualityExpression();
        let token = this.currentToken();
        while (token.type === PredefineTokenType.And) {
            this.nextToken();
            let right = this.parserEqualityExpression();
            left = new Ast.BinaryExpr(token, left, right);
            token = this.currentToken();
        }
        return left;
    }


    /**
     * EqualExpression := GreaterExpression (("=="|"!=") GreaterExpression)*
     */
    parserEqualityExpression(): Ast.Expr {
        let left = this.parserGreaterExpression();
        let token = this.currentToken();
        while (token.type === PredefineTokenType.Equal || token.type === PredefineTokenType.NotEqual) {
            this.nextToken();
            let right = this.parserGreaterExpression();
            left = new Ast.BinaryExpr(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * GreaterExpression := AdditionExpression ((">"|">="|"<"|"<=") AdditionExpression)*

     */
    parserGreaterExpression(): Ast.Expr {
        let left = this.parserAdditionExpression();
        let token = this.currentToken();
        while (token.type === PredefineTokenType.Greater || token.type === PredefineTokenType.GreaterEqual
            || token.type === PredefineTokenType.Less || token.type === PredefineTokenType.LessEqual) {
            this.nextToken();
            let right = this.parserAdditionExpression();
            left = new Ast.BinaryExpr(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * AdditionExpression := MultiplicationExpression (("+"|"-") MultiplicationExpression)*
     */
    parserAdditionExpression(): Ast.Expr {
        let left = this.parserMultiplicationExpression();
        let token = this.currentToken();
        while (token.type === PredefineTokenType.Add || token.type === PredefineTokenType.Sub) {
            this.nextToken();
            let right = this.parserMultiplicationExpression();
            left = new Ast.BinaryExpr(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * MultiplicationExpression := TermailExpression (("*"|"/") TermailExpression)
     */
    parserMultiplicationExpression(): Ast.Expr {
        let left = this.parserTermailExpression();
        let token = this.currentToken();
        while (token.type === PredefineTokenType.Mul || token.type === PredefineTokenType.Div) {
            this.nextToken();
            let right = this.parserTermailExpression();
            left = new Ast.BinaryExpr(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * TermailExpression := "(" Expression ")"
     *                   | <id>
     *                   | <int>
     *                   | <real>
     *                   | <string>
     *                   | FunCallExpr
     */
    parserTermailExpression(): Ast.Expr {
        let token = this.currentToken();
        if (token.type === PredefineTokenType.LeftParen) {
            token = this.nextToken();
            let exp = this.parserExpression();
            this.match(PredefineTokenType.RightParen);
            return exp;
        } else if (token.type === PredefineTokenType.Indentifier) {
            if (this.peekToken().type === PredefineTokenType.LeftParen) {
                return this.parserFuncCallExpr();
            } else {
                this.nextToken();
                return new Ast.VarNode(token);
            }
        } else if (token.type === PredefineTokenType.Integer) {
            this.nextToken();
            return new Ast.ConstNode(token, TypeSymbol.IntegerType);
        } else if (token.type === PredefineTokenType.Real) {
            this.nextToken();
            return new Ast.ConstNode(token, TypeSymbol.RealType);
        } else if (token.type === PredefineTokenType.Bool) {
            this.nextToken();
            return new Ast.ConstNode(token, TypeSymbol.BoolType);
        } else if(token.type === PredefineTokenType.String) {
            this.nextToken();
            return new Ast.ConstNode(token, TypeSymbol.StringType);
        } else {
            throw this.invalid(token);
        }
    }

    /**
     * add(a, b);
     * <id> "(" Exp ("," Exp")*
     */
    private parserFuncCallExpr(): Ast.FuncCallExpr {
        let funcNameToken = this.match(PredefineTokenType.Indentifier);
        let paraList: Ast.Expr[] = [];
        this.match(PredefineTokenType.LeftParen);
        let token = this.currentToken();
        if (token.type !== PredefineTokenType.RightParen) {
            paraList.push(this.parserExpression());
            token = this.currentToken();
            while (token.type === PredefineTokenType.Comma) {
                this.nextToken();
                paraList.push(this.parserExpression());
                token = this.currentToken();
            }
        }
        this.match(PredefineTokenType.RightParen);
        return new Ast.FuncCallExpr(funcNameToken, paraList);
    }

    private nextToken() {
        if (this.mNextToken !== null) {
            this.mCurrentToken = this.mNextToken;
            this.mNextToken = null;
        } else {
            this.mCurrentToken = this.lexicalAnalysis.nextToken();
        }
        return this.mCurrentToken;
    }

    private peekToken() {
        if (this.mNextToken === null) {
            this.mNextToken = this.lexicalAnalysis.nextToken();
        }
        return this.mNextToken;
    }

    private currentToken() {
        if (this.mCurrentToken === null) {
            return this.nextToken();
        } else {
            return this.mCurrentToken;
        }
    }

    private match(type: TokenType) {
        let token = this.currentToken();
        this.nextToken();
        if (token.type !== type) {
            throw `(${token.line}:${token.column}) expect "${type.getText()}" but get "${token.value}"`;
        }
        return token;
    }

    private invalid(token: Token) {
        return `(${token.line}:${token.column}) invalid token "${token.value}"`;
    }
}