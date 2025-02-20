export default {
    meta: { /* ルールのメタ情報 */ },
    create(context) {
        return {
            "MemberExpression": function (node) {
                if (node.object.name === "console") {
                    context.report({
                        node,
                        message: "Unexpected console statement."
                    });
                }
            }
        };
    }
};
