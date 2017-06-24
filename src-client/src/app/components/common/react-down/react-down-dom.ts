export interface ReactDownDomPart {
    kind: string;
    raw?: string;
    props?: { [key: string]: string };
    children?: ReactDownDomPart[];
}

export interface ReactDownDomSection extends ReactDownDomPart {
    kind: 'section';
}

export interface ReactDownDomPage extends ReactDownDomPart {
    kind: 'page';
    children?: ReactDownDomSection[];
    page: string;
}

export interface ReactDownDom {
    pages: ReactDownDomPage[];
}

export function parseTemplate(template: string): ReactDownDom {

    let t = template;

    t = '\n' + t + '\n';

    // Remove Comments
    t = t.replace(/^\s*\/\/.*$/gm, '');

    // Combine Continuous Lines (Unless heading #, list -, or link []() on own line)
    t = t.replace(/^(#.*)$/gm, '\r\n$1\r');
    t = t.replace(/^(-.*)$/gm, '\r\n$1\r');
    t = t.replace(/^(\*.*)$/gm, '\r\n$1\r');
    t = t.replace(/^(\[.*\]\(.*\))$/gm, '\r\n$1\r');

    t = t.replace(/\n\n+/g, '\r');
    t = t.replace(/\n/g, ' ');
    t = t.replace(/\r /g, '\r');
    t = t.replace(/\r/g, '\n');
    t = t.replace(/\n(\s*\n)+/g, '\n');

    // DEBUG
    // t = t.replace(/\n/g, '\t\\r\\n\r\n');


    // Process Lines
    const lines = t.split('\n').filter(x => x.trim());

    let parts = lines.map(x => parseLine(x));
    parts = combineLists(parts);

    const pages = combinePages(parts);
    pages.forEach(x => {
        x.children = combineSections(x.children);
    });

    // {var} remains inside the string

    return { pages };
    // return JSON.stringify({ pages }, null, '  ') as any;
    // return lines.join('\n') as any;
    // return parts.map(x => `${JSON.stringify(x)}`).join('\n') as any;
    // return parts.map(x => `${x.kind} '${x.text}' ${JSON.stringify(x.values)} ${x.parts ? JSON.stringify(x.parts) : ''} ${x.kind ? '' : '\t\t' + x.raw}`).join('\n') as any;
}

function parseLine(x: string): ReactDownDomPart {
    let m: RegExpMatchArray = null;
    let kind = '';
    let text = '';
    let parts: ReactDownDomPart[] = [];
    let props: { [key: string]: string } = {};

    if (m = x.match(/^# %/)) {
        // Pages
        kind = 'page';
        text = x.replace(/^# %/, '');
        text = text.trim();

    } else if (m = x.match(/^#/)) {
        // Headings
        kind = 'heading';
        text = x.replace(/^#+/, '');
        props.level = '' + (x.length - text.length);
        text = text.trim();

    } else if (m = x.match(/^\*/)) {
        // Lists
        kind = 'item';
        text = x.replace(/^\*/, '');
        text = text.trim();

    } else if (m = x.match(/^\[(.*)\]\((.*)\)$/)) {
        // Links
        kind = 'loneLink';
        text = m[1].trim();
        props.url = m[2].trim();

    } else if (m = x.match(/^<([^\s]*)\s*(.*)\/>$/)) {
        // Xml
        kind = m[1].trim();

        let a = props.attributesRaw = m[2].trim();

        let i = 0;
        while (a) {
            const m = a.match(/^\s*([^\s=]+)='([^']*)'/)
                || a.match(/^\s*([^\s=]+)="([^"]*)"/);
            if (!m) { break; }

            props[m[1]] = m[2];
            a = a.substr(m[0].length);

            // Prevent Infinite Loop
            i++;
            if (i > 100) { break; }
        }

    } else {
        // Text
        kind = 'paragraph';
        text = '';//x;
        parts = parseParagraph(x);
    }

    props.text = text || undefined;

    return {
        raw: x,
        kind,
        props,
        children: parts.length ? parts : undefined,
    };
}


function parseParagraph(x: string): ReactDownDomPart[] {
    const parts: ReactDownDomPart[] = [];

    let m: RegExpMatchArray = null;
    let kind = '';
    let text = '';
    let props: { [key: string]: string } = {};

    x = x.trim();

    if (m = x.match(/\[(.*)\]\((.*)\)/)) {
        // Links
        kind = 'inlineLink';
        text = m[1].trim();
        props.url = m[2].trim();

        const i = x.indexOf(m[0]);
        const prefix = x.substr(0, i).trim();

        if (prefix) {
            parts.push({ kind: 'text', props: { text: prefix } });
        }
        parts.push({ kind, props: { text, ...props } });

        x = x.substr(i + m[0].length).trim();
        kind = '';
        text = '';
        props = {};
    }

    if (x) {
        parts.push({ kind: 'text', props: { text: x } });
    }

    // if (parts.length === 1 && parts[0].kind === 'inlineLink') {
    //     parts[0].kind = 'loneLink';
    // }

    return parts;
}

function combineLists(parts: ReactDownDomPart[]): ReactDownDomPart[] {
    const result: ReactDownDomPart[] = [];
    let l: ReactDownDomPart = null;

    for (let x of parts) {
        if (x.kind === 'item') {
            if (!l) {
                l = {
                    kind: 'list',
                    children: []
                };
                result.push(l);
            }
            l.children.push(x);
        } else {
            l = null;
            result.push(x);
        }
    }

    return result;
}


function combineSections(parts: ReactDownDomPart[]): ReactDownDomSection[] {
    let result: ReactDownDomSection[] = [];
    let section: ReactDownDomSection = { kind: 'section', props: { level: '0' }, children: [] };
    result.push(section);

    for (let x of parts) {
        if (x.kind === 'heading') {
            section = {
                kind: 'section',
                props: { level: x.props.level },
                children: [x]
            };
            result.push(section);
        } else {
            section.children.push(x);
        }
    }

    if (!result[0].children.length) {
        result = result.slice(1);
    }

    return result;
}

function combinePages(parts: ReactDownDomPart[]): ReactDownDomPage[] {
    const result: ReactDownDomPage[] = [];
    let page: ReactDownDomPage = { kind: 'page', props: {}, page: '', children: [] };
    result.push(page);

    for (let x of parts) {
        if (x.kind === 'page') {
            page = x as ReactDownDomPage;
            page.page = x.props.text;
            page.children = [];
            result.push(page);
        } else {
            page.children.push(x as any);
        }
    }

    return result;
}