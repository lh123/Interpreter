export interface SyntaxNode {
    column(): number;
    line(): number;
}