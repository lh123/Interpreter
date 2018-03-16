import { LexicalAnalysis } from "./analysis/LexicalAnalysis";
import { SourceCode } from "./analysis/SourceCode";
import { Parser } from "./analysis/Parser";
import { TokenType } from "./analysis/Token";
let s = new SourceCode(`var a=(a++&&b||++c)+(++b);
if(a > b){
    a = b;
} else {
    a = c;
}`);
let ana = new LexicalAnalysis(s);
// while(1){
//     let token = ana.nextToken();
//     console.log(token);
//     let a = 1;
//     if(token.type === TokenType.EOF) {
//         break;
//     }
// }
let p = new Parser(ana);
console.log(p.parser());

console.log("end");
