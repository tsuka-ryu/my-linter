import { parse } from "esprima";
import { traverse } from "estraverse";
import { EventEmitter } from "events";

class RuleContext extends EventEmitter {
  report({ message }) {
    this.emit("report", message);
  }
}

export default class MyLinter {
  constructor() {
    this._emitter = new EventEmitter();
    this._ruleContext = new RuleContext();
  }

  loadRule(rule) {
    const ruleExports = rule.create(this._ruleContext);
    // on(nodeType, nodeTypeCallback);
    // "MemberExpression"などのオブジェクトのキー＝nodeTypeが取れる
    Object.keys(ruleExports).forEach((nodeType) => {
      this._emitter.on(nodeType, ruleExports[nodeType]); // キーでアクセスして、"MemberExpression"に対して、create内のfunctionが設定される
    });
  }

  lint(code) {
    const messages = [];
    const addMessage = (message) => {
      messages.push(message);
    };
    this._ruleContext.on("report", addMessage);
    const ast = parse(code);
    traverse(ast, {
      // ASTの各ノードに入ったときに呼び出されるコールバック
      enter: (node) => {
        // this.emitter.onしてないnode.typeが来た場合は何も起こらない
        this._emitter.emit(node.type, node);
      },
      // ASTの各ノードから出る時に呼び出されるコールバック
      leave: (node) => {
        this._emitter.emit(`${node.type}:exit`, node);
      },
    });
    this._ruleContext.removeListener("report", addMessage);
    return messages;
  }
}
