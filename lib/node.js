const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const attrs = require("./attrs");
const mime = require("./mime");


module.exports = function processNode(node, cwd, basePath = __dirname) {
    const metaNode = {
        noteId: node.id ?? node.file ?? crypto.randomBytes(6).toString("hex"),
        title: node.title ?? path.basename(node.file ?? ""),
        type: node.type ?? "code",
        mime: mime(node),
        attributes: node.attributes ? attrs(node.attributes) : [],
        attachments: [],
        children: []
    };

    if (node.children?.length) {
        const name = node.file ? path.basename(node.file).replace(path.extname(node.file), "") : node.title ?? node.type;
        const subdir = path.join(cwd, name);
        fs.mkdirSync(subdir, {recursive: true});
        metaNode.dirFileName = name;
        for (const c of node.children) {
            const result = processNode(c, subdir, basePath);
            metaNode.children.push(result);
        }
    }

    if (node.file) {
        fs.copyFileSync(path.join(basePath, node.file), path.join(cwd, path.basename(node.file)));
        metaNode.dataFileName = path.basename(node.file);
    }

    return metaNode;
};