function getAnchor(target: EventTarget): HTMLAnchorElement | undefined {
  if (!(target instanceof Element)) return;
  return target.closest("a");
}

function isLocal(href: string) {
  return /^\.?\//.test(href);
}

let ids = 0;
let currentId = `nav-0`;
async function onClick(event: MouseEvent) {
  const anchor = getAnchor(event.target);
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!isLocal(href)) return;
  event.preventDefault();
  try {
    await navigateTo(new URL(href, window.location.toString()));
  } catch (e) {
    window.location.assign(new URL(href, window.location.toString()));
  }
}

async function get(url: URL) {
  const html = await fetch(url.toString(), {
    headers: new Headers([["accept", "text/html"]]),
    redirect: "follow",
  }).then((res) => {
    if (!res.headers.get("content-type").includes("text/html")) {
      throw new Error(`Unexpected content-type "${res.headers.get('content-type')}"`);
    }
    return res.text();
  });
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc;
}

async function navigateTo(url: URL, replace = false) {
  let id = `nav-${ids++}`;
  currentId = id;

  if (!replace && url.toString() === window.location.toString()) {
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "auto" });
    ariaCurrent(document.querySelector("#nav"));
    return;
  }

  const newDoc = await get(url);
  if (currentId !== id) {
    return;
  }
  swapHead(document.head, newDoc.head, new URL(window.location.toString()), url);
  swap(
    document.querySelector("[astro-icon-spritesheet]"),
    newDoc.querySelector("[astro-icon-spritesheet]")
  );
  swapAttrs(document.querySelector("#nav"), newDoc.querySelector("#nav"));
  swap(document.querySelector("#root"), newDoc.querySelector("#root"));
  if (!replace) {
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "auto" });
    ariaCurrent(document.querySelector("#nav"));
  } else {
    window.history.replaceState({}, "", url);
    ariaCurrent(document.querySelector("#nav"));
  }
}

function swap(oldEl: Element, newEl: Element) {
  oldEl.replaceChildren(...newEl.childNodes);
}

function ariaCurrent(nav: HTMLElement) {
  const oldCurrentPage = nav.querySelector('[aria-current="page"]');
  if (oldCurrentPage) {
    oldCurrentPage.removeAttribute("aria-current");
  }
  const href = window.location.pathname.split("/").slice(1, 2);
  const newCurrentPage = nav.querySelector(`[href="/${href}"]`);
  if (newCurrentPage) {
    newCurrentPage.setAttribute("aria-current", "page");
  }
}

function swapAttrs(oldEl: HTMLElement, newEl: HTMLElement) {
  const oldAttrs = new Map<string, string>();
  const newAttrs = new Map<string, string>();

  for (const { name, value } of oldEl.attributes) {
    oldAttrs.set(name, value);
  }

  for (const { name, value } of newEl.attributes) {
    if (oldAttrs.has(name) && oldAttrs.get(name) === value) {
      oldAttrs.delete(name);
    } else {
      newAttrs.set(name, value);
    }
  }

  for (const [name] of oldAttrs.keys()) {
    oldEl.removeAttribute(name);
  }
  for (const [name, value] of newAttrs.entries()) {
    oldEl.setAttribute(name, value);
  }
}

function isScript(node: Node): node is HTMLScriptElement {
    return (node as Element).localName === 'script';
}
function isLink(node: Node): node is HTMLLinkElement {
    return (node as Element).localName === 'link';
}
function getUrlAttr(node: HTMLLinkElement|HTMLScriptElement): string {
    switch (node.localName) {
        case 'link': return 'href';
        case 'script': return 'src';
    }
}
const xml = new XMLSerializer();
function serialize(node: Node, baseURL: URL): string {
  if (isLink(node) || isScript(node)) {
    const el = node.cloneNode() as HTMLLinkElement;
    const key = getUrlAttr(node);
    const value = el.getAttribute(key);
    if (!isLocal(value)) {
        return xml.serializeToString(node);
    }
    const url = new URL(value, baseURL);
    el.setAttribute(key, url.toString())
    const output = xml.serializeToString(el)
    return output;
  }
  return xml.serializeToString(node);
}
function swapHead(oldHead: HTMLHeadElement, newHead: HTMLHeadElement, oldURL: URL, newURL: URL) {
  let oldWalker = document.createTreeWalker(oldHead, NodeFilter.SHOW_ELEMENT);
  let newWalker = document.createTreeWalker(newHead, NodeFilter.SHOW_ELEMENT);
  let oldNodes = new Map<string, Element>();
  let newNodes = new Map<string, Element>();

  while (oldWalker.nextNode()) {
    const node = oldWalker.currentNode as Element;
    oldNodes.set(serialize(node, oldURL), node);
  }

  while (newWalker.nextNode()) {
    const node = newWalker.currentNode as Element;
    const key = serialize(node, oldURL);

    if (oldNodes.has(key)) {
      oldNodes.delete(key);
    } else {
      newNodes.set(serialize(node, newURL), node);
    }
  }

  for (const removedNode of oldNodes.values()) {
    removedNode.remove();
  }
  for (const addedNode of newNodes.values()) {
    oldHead.appendChild(addedNode);
  }
}

function onPopState(event: PopStateEvent) {
  event.preventDefault();
  navigateTo(new URL(window.location.toString()), true);
}

window.addEventListener("click", onClick);
window.addEventListener("popstate", onPopState);
