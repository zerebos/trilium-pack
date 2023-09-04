module.exports = function(attrObject) {
    const attrs = [];
    for (const a in attrObject) {
        const type = a.startsWith("~") ? "relation" : "label";
        const name = a.slice(1);
        const value = attrObject[a];
        attrs.push({type, name, value});
    }
    return attrs;
};