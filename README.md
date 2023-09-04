# trilium-pack

A simple way to pack addons as `zip` files for [Trilium Notes](https://github.com/zadam/trilium).

Note: This is still early in development and things may change rapidly. Use at your own discretion.

## Install

```sh
npm install trilium-pack
```

## Usage

### CLI

To use this via cli (or npm `scripts`) you'll have to setup your config in either a `tpack.json` or `tpack.config.json`. In either case, trilium-pack will find the config and pack your addon.

#### Global

If you installed the package globally, just run `tpack`!

#### Local

Just add `tpack` to your npm `scripts`!

```json
{
    "scripts": {
        "dist": "tpack"
    }
}
```

### Node

```js
const packAddon = require("trilium-pack");

// Replace with your config
const config = {};

// __dirname is the default so this is optional
const opts = {basePath: __dirname};

packAddon(config, opts);
```

## Configuration

Currently, the configuration only has 2 top-level properties, `output` and `notes`, both are required.

| Name | Type | Description |
|:----:|:----:|:------------|
|`output`|`string`|A path to the desired output relative to the configuration file.|
|`notes`|`object`|A tree of notes to be created with the root being a singular note.|

### Notes

Each note can have several different properties, some of them optional, and some of them have defaults.

| Name | Type | Optional | Default | Description |
|:----:|:----:|:--------:|:-------:|:------------|
|`file`|`string`|❌*||Relative path string to the file to be included. *This may be omitted only for `"render"` notes.|
|`title`|`string`|✅|filename|Title to be displayed in Trilium (affects pseudo-import name for scripts).|
|`type`|`string`|✅|`"code"`|Type of note to be created. Only `"code"`, `"file"` and `"render"` are currently supported due to the scope of this project.|
|`mime`|`string`|✅|`auto`|Mime type to set for the note, this will be automatically determined from the file extension where possible.|
|`env`|`string`|✅|`"frontend"`|Script environment for `js` notes. Should be either `"frontend"` or `"backend"`.|
|`attributes`|`object`|✅|`{}`|Attributes to be set on the imported note.|
|`children`|`Array<Note>`|✅|filename|Title to be displayed in Trilium (affects pseudo-import name for scripts).|

#### Attributes

Due to the scope of the project, this does not support the full set of attribute features from Trilium such as inheritence. This only accepts a simple `Record<string, string>` set of attributes, where the `key` is the name of the attribute and the `value` is the value of the attribute. Every `key` can start with `#` or `~` to indicate `label` or `relation` type respectively. For `relation` notes, the value should be set to the target `note.file` string, abd it will be resolved automatically. For simple labels like `#widget` you can simply use an empty string `""` as the value.

```js
{
    "#widget": "",
    "#run": "frontendStartup",
    "~renderNote": "static/page.html",
}
```

### Example

This example was tested with [Trilium Heatmap](https://github.com/dvai/Trilium-Heatmap).

`tpack.config.js`
```js
module.exports = {
    output: "dist/Trilium-Heatmap.zip",
    notes: {
        title: "Trilium Heatmap",
        type: "render",
        attributes: {
            "~renderNote": "static/main.html"
        },
        children: [
            {
                file: "static/main.html",
                title: "HTML",
                children: [
                    {
                        file: "src/main.js",
                        env: "frontend",
                        children: [
                            {
                                title: "getDatas", // ensures import name
                                file: "scripts/getDatas.js",
                                attributes: {"#heatmapDatas": ""}
                            },
                            {
                                title: "setHistoryCount", // ensures import name
                                file: "scripts/setHistoryCount.js",
                                attributes: {"#run": "frontendStartup"}
                            },
                            {
                                file: "lib/d3.js",
                                title: "d3", // ensures import name
                                type: "file"
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
```

## More Info

### Plans

- Add more MIME types as needed

### Known Limitations

- Attributes don't support all attributes
- Only 3 note types supported
- Only a subset of MIME types supported