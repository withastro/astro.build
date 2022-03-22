const stopWords = ['a', 'an', 'and', 'are', 'aren\'t', 'as', 'by', 'can', 'cannot', 'can\'t', 'could', 'couldn\'t', 'how', 'is', 'isn\'t', 'it', 'its', 'it\'s', 'that', 'the', 'their', 'there', 'they', 'they\'re', 'them', 'to', 'too', 'us', 'very', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whenever', 'where', 'with', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'the', 'vanilla', 'javascript', 'js'];

export function search(inputId: string, selector: string) {
    const style = document.createElement('style');
    style.innerHTML = `
        ${selector}[hidden] {
            display: none;
        }
    `;
    document.head.appendChild(style);

    const input = document.getElementById(inputId) as HTMLInputElement;
    const items = document.querySelectorAll<HTMLElement>(selector);

    const update = () => {
        const regexMap = input.value.toLowerCase()
            .split(' ')
            .filter(word => word.length && !stopWords.includes(word))
            .map(word => new RegExp(word, 'i'));

        for (const item of items) {
            const isMatch = !regexMap.length || regexMap.some(regex => !!item.textContent.match(regex));
            isMatch ? item.removeAttribute('hidden') : item.setAttribute('hidden', '');
        }
    }

    input.addEventListener('input', update, true);
    
    update();
}