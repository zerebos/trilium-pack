const os = require("os");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const validateConfig = require("./valid");
const processNode = require("./node");


module.exports = function pack(config, opts = {}) {

    const {basePath = __dirname} = opts;

    // This will throw or warn as needed
    validateConfig(config);

    const DIST_DIR = path.join(basePath, path.dirname(config.output));
    const TMP_DIR = path.join(os.tmpdir(), "trilium-pack");
    const META_PATH = path.join(TMP_DIR, "!!!meta.json");
    const ZIP_PATH = path.join(DIST_DIR, path.basename(config.output));

    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, {recursive: true});
    if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, {recursive: true});
    fs.mkdirSync(TMP_DIR, {recursive: true});
    

    /**
     * Trilium doesn't seem to check formatVersion or appVersion
     * but we might as well set them just in case.
     */
    const metaInfo = {
        formatVersion: 2,
        appVersion: "0.61.4-beta",
        files: [
            processNode(config.notes, TMP_DIR, basePath)
        ]
    };
    
    fs.writeFileSync(META_PATH, JSON.stringify(metaInfo, null, 4));
    
    const outZip = fs.createWriteStream(ZIP_PATH);
    const zip = archiver("zip", {zlib: {level: 9}});
    outZip.on("close", () => {
        fs.rmSync(TMP_DIR, {recursive: true});
        console.log(`✅ Packed successfully as ${ZIP_PATH}`); // eslint-disable-line no-console
    });
    zip.pipe(outZip);
    zip.directory(TMP_DIR, false);
    zip.finalize();
};
