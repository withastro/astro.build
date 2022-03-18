export class FlyoutMenu extends HTMLElement {
    #hoverOpened = false;

    connectedCallback() {
        this.button.addEventListener('click', () => this.toggle());
        this.button.addEventListener('mouseenter', () => this.onMouseEnter());
        this.button.addEventListener('mouseleave', () => this.onMouseLeave());
    }

    get button(): HTMLButtonElement {
        return this.querySelector('button[type="button"]');
    }

    get content() {
        return this.querySelector('section');
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(value: boolean) {
        if (value) {
            this.setAttribute('open', '');
            this.content.setAttribute('aria-hidden', 'false');
        } else {
            this.removeAttribute('open');
            this.content.setAttribute('aria-hidden', 'true');
        }
    }

    toggle() {
        this.open = !this.open;
    }

    onMouseEnter() {
        if (this.open) { return; }

        this.#hoverOpened = true;
        this.open = true;
    }

    onMouseLeave() {
        if (!this.open || !this.#hoverOpened) { return; }
        this.open = false;
    }
}

customElements.define('flyout-menu', FlyoutMenu);
