import { LexicalAnalysis } from "./LexicalAnalysis";
import { Token, TokenType, getTokenValueByType } from "./Token";

import * as Ast from "../ast";
import { BinaryExpression } from "../ast";

export class Parser {

    private lexicalAnalysis: LexicalAnalysis;
    private mCurrentToken: Token | null = null;
    private mNextToken: Token | null = null;

    constructor(lexicalAnalysis: LexicalAnalysis) {
        this.lexicalAnalysis = lexicalAnalysis;
    }

    parser(): Ast.Program {
        let token = this.currentToken();
        let statements: Ast.Statement[] = [];
        while (token.type !== TokenType.EOF) {
            let statement = this.parserStatement();
            if (statement !== null) {
                statements.push(statement);
            }
            token = this.currentToken();
        }
        return new Ast.Program(statements);
    }

    /**
     * Block := "{" (Statement)* "}";
     */
    private parserBlockStatement(): Ast.Statement {
        let statementList: Ast.Statement[] = [];
        this.match(TokenType.LeftBrace);
        let token = this.currentToken();
        while (token.type !== TokenType.RightBrace) {
            let statement = this.parserStatement();
            if (statement) {
                statementList.push(statement);
            }
            token = this.currentToken();
        }
        this.match(TokenType.RightBrace);
        return new Ast.BlockStatement(statementList);
    }

    /**
     * Statement := "var" <id> ("," <id>)* ( "=" Expression ("," Expression)*)? ";"
     *           |  <id> ("," <id>)* "=" Expression ("," Expression)? ";"
     *           |  "if" "(" Expression ")" 
     *                  Block 
     *              ("else if" "(" Expression ")"
     *                  Block
     *              "else"
     *                  Block)?
     *           |  "do" 
     *                  Block 
     *              "while" "(" Expression ")" ";""
     *           |  "while" "(" Expression ")" ";"
     *           |  "while" "(" Expression ")" 
     *                  Block
     *           |  Block
     */
    private parserStatement(): Ast.Statement | null {
        let token = this.currentToken();
        if (token.type === TokenType.Semicolon) {
            this.nextToken();
            return null;
        } else if (token.type === TokenType.Do) {
            return this.parserDoWhileStatement();
        } else if (token.type === TokenType.While) {
            return this.parserWhileStatement();
        } else if (token.type === TokenType.If) {
            return this.parserIfStatement();
        } else if (token.type === TokenType.Var) {
            this.nextToken();
            let names = this.parserNameList();
            let expressions: Ast.Expression[] = [];
            token = this.currentToken();
            if (token.type === TokenType.Assign) {
                this.nextToken();
                expressions.push(...this.parserExpressionList());
            }
            this.match(TokenType.Semicolon);
            return new Ast.DeclarationStatement(names, expressions);
        } else if (token.type === TokenType.Id) {
            let variables = this.parserNameList();
            this.match(TokenType.Assign);
            let expressions = this.parserExpressionList();
            this.match(TokenType.Semicolon);
            return new Ast.AssignStatement(variables, expressions);
        } else if (token.type === TokenType.LeftBrace) {
            return this.parserBlockStatement();
        } else {
            throw this.invalid(token);
        }
    }

    /** 
     * "while" "(" Expression ")"
     *      Block
     * "while" "(" Expression ")" ";"
     */
    private parserWhileStatement() {
        this.match(TokenType.While);
        this.match(TokenType.LeftParen);
        let exp = this.parserExpression();
        this.match(TokenType.RightParen);
        let token = this.currentToken();
        let block: Ast.Statement | null = null;
        if (token.type === TokenType.LeftBrace) {
            block = this.parserBlockStatement();
        } else {
            this.match(TokenType.Semicolon);
        }
        return new Ast.WhileStatement(exp, block);
    }

    /* "do" 
    *       Block 
    *  "while" "(" Expression ")" ";""
    */
    private parserDoWhileStatement() {
        this.match(TokenType.Do);
        let block = this.parserBlockStatement();
        this.match(TokenType.While);
        this.match(TokenType.LeftParen);
        let exp = this.parserExpression();
        this.match(TokenType.RightParen);
        this.match(TokenType.Semicolon);
        return new Ast.DoWhileStatement(block, exp);
    }

    private parserIfStatement() {
        this.match(TokenType.If);
        this.match(TokenType.LeftParen);
        let exp = this.parserExpression();
        this.match(TokenType.RightParen);
        let trueBranch = this.parserBlockStatement();
        let falseBranch = this.parserFalseBranch();
        return new Ast.IfStatement(exp, trueBranch, falseBranch);
    }

    private parserFalseBranch(): Ast.Statement | null {
        let token = this.currentToken();
        if (token.type === TokenType.Else) {
            this.nextToken();
            token = this.currentToken();
            if (token.type === TokenType.If) { //else if
                return this.parserElseIfStatement();
            } else if (token.type === TokenType.LeftBrace) { //else
                return this.parserElseStatement();
            } else {
                throw this.invalid(token);
            }
        } else {
            return null;
        }
    }

    private parserElseIfStatement(): Ast.Statement {
        this.nextToken(); //skip else if
        this.match(TokenType.LeftParen);
        let expression = this.parserExpression();
        this.match(TokenType.RightParen);
        let trueBranch = this.parserBlockStatement();
        let falseBranch = this.parserFalseBranch();
        return new Ast.ElseIfStatement(expression, trueBranch, falseBranch);
    }

    private parserElseStatement(): Ast.Statement {
        let block = this.parserBlockStatement();
        return new Ast.ElseStatement(block);
    }

    private parserNameList() {
        let nameList: Ast.IndentifierExpression[] = [];
        let token = this.currentToken();
        this.match(TokenType.Id);
        nameList.push(new Ast.IndentifierExpression(token));
        token = this.currentToken();
        while (token.type === TokenType.Comma) {
            this.nextToken();
            token = this.currentToken();
            this.match(TokenType.Id);
            nameList.push(new Ast.IndentifierExpression(token));
            token = this.currentToken();
        }
        return nameList;
    }

    private parserExpressionList() {
        let expressions: Ast.Expression[] = [];
        let exp = this.parserExpression();
        expressions.push(exp);
        let token = this.currentToken();
        while (token.type === TokenType.Comma) {
            this.nextToken();
            exp = this.parserExpression();
            expressions.push(exp);
            token = this.currentToken();
        }
        return expressions;
    }

    /**
     * Expression := LogicalOrExpression ("," LogicalOrExpression)*
     */
    parserExpression(): Ast.Expression {
        return this.parserLogicalOrExpression();
    }

    /**
     * LogicalOrExpression := LogicalAndExpression ("||" LogicalAndExpression)*
     */
    parserLogicalOrExpression(): Ast.Expression {
        let left = this.parserLogicalAndExpression();
        let token = this.currentToken();
        while (token.type === TokenType.Or) {
            this.nextToken();
            let right = this.parserLogicalAndExpression();
            left = new BinaryExpression(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * LogicalAndExpression := EqualExpression ("&&" EqualExpression)*
     */
    parserLogicalAndExpression(): Ast.Expression {
        let left = this.parserEqualityExpression();
        let token = this.currentToken();
        while (token.type === TokenType.And) {
            this.nextToken();
            let right = this.parserEqualityExpression();
            left = new BinaryExpression(token, left, right);
            token = this.currentToken();
        }
        return left;
    }


    /**
     * EqualExpression := GreaterExpression (("=="|"!=") GreaterExpression)*
     */
    parserEqualityExpression(): Ast.Expression {
        let left = this.parserGreaterExpression();
        let token = this.currentToken();
        while (token.type === TokenType.Equal || token.type === TokenType.NotEqual) {
            this.nextToken();
            let right = this.parserGreaterExpression();
            left = new BinaryExpression(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * GreaterExpression := AdditionExpression ((">"|">="|"<"|"<=") AdditionExpression)*

     */
    parserGreaterExpression(): Ast.Expression {
        let left = this.parserAdditionExpression();
        let token = this.currentToken();
        while (token.type === TokenType.Greater || token.type === TokenType.GreaterEqual
            || token.type === TokenType.Less || token.type === TokenType.LessEqual) {
            this.nextToken();
            let right = this.parserAdditionExpression();
            left = new BinaryExpression(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * AdditionExpression := MultiplicationExpression (("+"|"-") MultiplicationExpression)*
     */
    parserAdditionExpression(): Ast.Expression {
        let left = this.parserMultiplicationExpression();
        let token = this.currentToken();
        while (token.type === TokenType.Add || token.type === TokenType.Sub) {
            this.nextToken();
            let right = this.parserMultiplicationExpression();
            left = new BinaryExpression(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * MultiplicationExpression := PrefixExpression (("*"|"/") PrefixExpression)*
     */
    parserMultiplicationExpression(): Ast.Expression {
        let left = this.parserPrefixExpression();
        let token = this.currentToken();
        while (token.type === TokenType.Mul || token.type === TokenType.Div) {
            this.nextToken();
            let right = this.parserPrefixExpression();
            left = new BinaryExpression(token, left, right);
            token = this.currentToken();
        }
        return left;
    }

    /**
     * PrefixExpression := ("+"|"-"|"++"|"--"|"!")? PostfixExpression
     */
    parserPrefixExpression(): Ast.Expression {
        let token = this.currentToken();
        if (token.type === TokenType.Add
            || token.type === TokenType.Sub
            || token.type === TokenType.SelfAdd
            || token.type === TokenType.SelfSub
            || token.type === TokenType.Not) {
            this.nextToken();
            let postfix = this.parserPostfixExpression();
            return new Ast.PrefixExpression(token, postfix);
        } else {
            return this.parserPostfixExpression();
        }
    }

    /**
     * PostfixExpression := TermailExpression ("++"|"--")?
     */
    parserPostfixExpression(): Ast.Expression {
        let termail = this.parserTermailExpression();
        let token = this.currentToken();
        if (token.type === TokenType.SelfAdd || token.type === TokenType.SelfSub) {
            this.nextToken();
            return new Ast.PostfixExpression(token, termail);
        } else {
            return termail;
        }
    }

    /**
     * TermailExpression := "(" Expression ")"
     *                   | <id>
     *                   | <num>
     */
    parserTermailExpression(): Ast.Expression {
        let token = this.currentToken();
        if (token.type === TokenType.LeftParen) {
            token = this.nextToken();
            let exp = this.parserExpression();
            this.match(TokenType.RightParen);
            return exp;
        } else if (token.type === TokenType.Id) {
            this.nextToken();
            return new Ast.IndentifierExpression(token);
        } else if (token.type === TokenType.Number) {
            this.nextToken();
            return new Ast.ConstNumberExpression(token);
        } else {
            throw this.invalid(token);
        }
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
            throw `(${token.line}:${token.column}) expect "${getTokenValueByType(type)}" but get "${token.value}"`;
        }
    }

    private invalid(token: Token) {
        return `(${token.line}:${token.column}) invalid token "${token.value}"`;
    }
}