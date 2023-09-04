const path = require("path");

module.exports = function(node) {
    if (!node.file) return "";
    const env = node.env ?? "frontend";
    const ext = path.extname(node.file).replace(".", "");
    if (ext === "css") return "text/css";
    if (ext === "html") return "text/html";
    if (ext === "js") return `application/javascript;env=${env}`;
    return "";
};