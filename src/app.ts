import { Source } from "./frontend/Source";
import { LexicalAnalysis } from "./frontend/LexicalAnalysis";
import { PredefineTokenType } from "./frontend/PredefineTokenType";
import { Parser } from "./frontend/Parser";
import { Interpreter } from "./interpreter/Interpreter";
import { Environment } from "./interpreter/Environment";

let s = new Source(`
function fib(n:int):int {
    if(n < 2) {
        return n;
    } else {
        return fib(n-1) + fib(n-2);
    }
}
var result: int = fib(10);
printf(result);
`);
let ana = new LexicalAnalysis(s);

// while (1) {
//     let token = ana.nextToken();
//     console.log(token.toString());
//     if(token.type === PredefineTokenType.EOF) {
//         break;
//     }
// }

let parser = new Parser(ana);
let interpret = new Interpreter(parser, new Environment());
interpret.run();
console.log("end");