const VALID_TYPES = new Set(["file", "code", "render"]);

/* eslint-disable no-console */

function validateNode(node) {
    if (!node.file && node.type !== "render") throw new Error(`Non-render note missing "file" property. ${node}`);
    if (!node.title) console.warn(`⚠ Note ${node.file} is missing title, filename will be used.`);
    if (node.attributes && typeof(node.attributes) !== "object") throw new Error(`Attributes configuration should be an object, received ${node.attributes}.`);
    if (node.attributes) {
        for (const a in node.attributes) {
            const isRelation = a.startsWith("~");
            const isLabel = a.startsWith("#");
            if (!isRelation && !isLabel) console.warn(`⚠ Attribute ${a} type not asserted, assuming to be label.`);
        }
    }
    if (node.children && !Array.isArray(node.children)) throw new Error(`Children should be an array, received ${node.children}.`);
    if (node.type && !VALID_TYPES.has(node.type)) throw new Error(`Unsupported note type ${node.type}`);
    if (node.children) {
        for (const c of node.children) validateNode(c);
    }
}

module.exports = function validateConfig(config) {
    if (!config || typeof(config) !== "object") throw new Error("Pack config should be an object.");
    if (!config.output) throw new Error("Pack config missing output target.");
    if (typeof(config.output) !== "string") throw new Error(`Invalid output config: Expected string, got ${typeof(config.output)}.`);
    if (!config.notes || typeof(config.notes) !== "object") throw new Error(`Pack config missing "notes" object.`);
    validateNode(config.notes);
};