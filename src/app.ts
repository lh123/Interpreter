import { Source } from "./frontend/Source";
import { LexicalAnalysis } from "./frontend/LexicalAnalysis";
import { Parser } from "./frontend/Parser";
import { Interpreter } from "./interpreter/Interpreter";
import { Environment } from "./interpreter/Environment";
import * as fs from "fs";
import { PredefineTokenType } from "./frontend/PredefineTokenType";

let s = new Source(fs.readFileSync("F:/Development/VSCode/Compiler/src/test.txt", { encoding: "utf-8" }));
let ana = new LexicalAnalysis(s);
// while(1){
//     let token = ana.nextToken();
//     console.log(token.toString());
//     if(token.type === PredefineTokenType.EOF){
//         break;
//     }
// }
let parser = new Parser(ana);
let interpret = new Interpreter(parser, new Environment());
interpret.run();