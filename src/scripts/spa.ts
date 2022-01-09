const isElement = (target: EventTarget): target is Element => target instanceof Element;
const isLocalUrl = (href: string) => {
    try {
        return new URL(href).origin === window.location.origin;
    } catch (e) {}
    return false;
}
const getUrl = ({ target }: Event): URL|undefined => {
    if (!isElement(target)) return;
    const a = target.closest('a');
    if (!a) return;
    const { href } = a;
    if (!isLocalUrl(href)) return;
    return new URL(href);
}

const p = new DOMParser();
window.addEventListener('click', async (event) => {
    const url = getUrl(event);
    if (!url) return;
    event.preventDefault();
    navigate(url);
})

window.addEventListener('popstate', () => {
    navigate(new URL(window.location.toString()), true);
})

async function navigate(url: URL, isBack: boolean = false) {
    const contents = await fetch(`${url}`).then(res => res.text());
    const html = p.parseFromString(contents, 'text/html');
    diff(document, html);

    if (isBack) {
        return;
    } else {
        history.pushState({}, '', url);
        window.scrollTo({ top: 0 })
    }
}

const s = new XMLSerializer();
function diff(a: Document, b: Document) {
    function sync(from: Element, to: Element) {
        for (const attr of to.attributes) {
            let { namespaceURI, name, value } = attr;
            if (namespaceURI) {
                name = attr.localName || name;
                const oldValue = from.getAttributeNS(namespaceURI, name);
                if (oldValue !== value) {
                    if (attr.prefix === 'xmlns'){
                        name = attr.name;
                    }
                    from.setAttributeNS(namespaceURI, name, value);
                }
            } else {
                const oldValue = from.getAttribute(name);
                if (oldValue !== value) {
                    from.setAttribute(name, value);
                }
            }
        }
        for (const attr of from.attributes) {
            let { namespaceURI, name } = attr; 
            if (namespaceURI) {
                name = attr.localName || name;
                if (!to.hasAttributeNS(namespaceURI, name)) {
                    from.removeAttributeNS(namespaceURI, name)
                }
            } else {
                if (!to.hasAttribute(name)) {
                    from.removeAttribute(name);
                }
            }
        }
    }

    // Sync attributes
    for (const el of ['documentElement', 'head', 'body']) {
        sync(a[el], b[el]);
    }

    // Head logic
    function getHeadKey(node: Element) {
        switch (node.localName) {
            case 'title': return 'title';
            case 'meta': {
                if (node.hasAttribute('name')) {
                    return `meta[name=${node.getAttribute('name')}]`;
                } else if (node.hasAttribute('property')) {
                    return `meta[property=${node.getAttribute('property')}]`;
                }
                return;
            }
        }
    }

    const keys = new Map();
    const remove = new Map();
    const add = new Map();

    for (const child of a.head.children) {
        const key = getHeadKey(child);
        if (key) {
            keys.set(key, child);
        } else {
            remove.set(s.serializeToString(child), child);
        }
    }
    for (const child of b.head.children) {
        let key = getHeadKey(child);
        if (key) {
            sync(keys.get(key), child);
            continue;
        }
        key = s.serializeToString(child);
        
        if (remove.has(key)) {
            remove.delete(key);
            continue;
        }

        add.set(key, child);
    }
    for (const node of remove.values()) {
        node.remove();
    }
    for (const node of add.values()) {
        a.head.appendChild(node);
    }

    // Body
    const oldBody = new Map<string, Element>();
    const newBody = new Set<Element>();
    for (const child of a.body.children) {
        oldBody.set(s.serializeToString(child), child);
    }
    outer: for (const child of b.body.children) {
        const key = s.serializeToString(child);
        if (oldBody.has(key)) {
            oldBody.delete(key);
            continue;
        }

        for (const [oldKey, oldChild] of oldBody.entries()) {
            if (oldChild.localName === child.localName) {
                sync(oldChild, child);
                oldChild.replaceChildren(...child.children);
                oldBody.delete(oldKey);
                continue outer;
            }
        }
        newBody.add(child);
    }
    for (const node of oldBody.values()) {
        node.remove();
    }
    for (const node of newBody.values()) {
        a.body.appendChild(node);
    }
}
