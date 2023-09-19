export type LabelAttribute = `#${string}`;
export type RelationAttribute = `~${string}`;
export type Attribute = LabelAttribute | RelationAttribute;
export type NoteType = "file" | "code" | "render";
export type Note = RenderNote | CodeNote | FileNote | AutoNote;

interface BaseNote {
    title?: string;
    type?: NoteType;
    file: string;
    attributes?: Record<Attribute, string>;
    children?: Note[];
}

export interface RenderNote extends Omit<BaseNote, "file"> {
    type: "render";
}

export interface AutoNote extends BaseNote {
    type?: undefined;
    file: string;
}

export interface CodeNote extends BaseNote {
    type: "code";
    file: string;
}

export interface FileNote extends BaseNote {
    type: "file";
    file: string;
}

export interface Config {
    output: string;
    notes: Note;
}

export interface PackOptions {
    basePath?: string;
}

type PackFunction = (config: Config, opts: PackOptions) => void;

export default PackFunction;