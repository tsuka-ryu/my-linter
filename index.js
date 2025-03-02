import assert from "assert";
import MyLinter from "./MyLinter.js";
import noConsole from "./no-console.js";
import noConsole2 from "./no-console2.js";

const linter = new MyLinter();
linter.loadRule(noConsole);
linter.loadRule(noConsole2);
const code = `
function add(x, y){
    console.log(x, y);
    return x + y;
}
add(1, 3);
`;
const results = linter.lint(code);
assert(results.length > 0);
assert.equal(results[0], "Unexpected console statement.");
console.log({results})