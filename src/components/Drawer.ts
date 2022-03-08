import { createFocusTrap } from 'focus-trap';
import type { FocusTrap } from 'focus-trap';

export class AstroDrawer extends HTMLElement {
    #focusTrap: FocusTrap;

    connectedCallback() {
        this.#focusTrap = createFocusTrap(this, {
            onDeactivate: this.close.bind(this)
        });

        window.addEventListener('drawer:open', this.onDrawerOpen.bind(this), false)
        window.addEventListener('drawer:close', this.onDrawerClose.bind(this), false)
    }

    onDrawerOpen(event: CustomEvent<string>) {
        if (event.detail === this.id) {
            this.open();
        }
    }

    onDrawerClose(event: CustomEvent<string>) {
        if (event.detail === this.id) {
            this.close();
        }
    }

    get id() {
        return this.getAttribute('id');
    }

    get isOpen() {
        return this.getAttribute('aria-hidden') === 'false';
    }

    open() {
        this.setAttribute('aria-hidden', 'false');
        this.#focusTrap.activate();
        document.documentElement.classList.add('drawer-open');
    }

    close() {
        this.setAttribute('aria-hidden', 'true');
        this.#focusTrap.deactivate();
        document.documentElement.classList.remove('drawer-open');
    }
}

customElements.define('astro-drawer', AstroDrawer);
