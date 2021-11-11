class Contact
{
    openBtn:    Element;
    overlay:    Element;
    closeBtn:   Element;

    constructor()
    {
        this.openBtn =  document.querySelector('.site > header .navItem.contact');
        this.overlay =  document.querySelector('body > .contactBlock');
        this.closeBtn = this.overlay.querySelector('.closeBtn');

        this.openBtn.addEventListener('click', () => this.setState(true));

        [this.overlay, this.closeBtn].forEach(closeElem =>
        {
            closeElem.addEventListener('click', (e) =>
            {
                if (e.target === closeElem)
                    this.setState(false);
            });
        });
    }

    setState(showing: boolean)
    {
        this.overlay.classList.toggle('_showing', showing);
    }
}

window.addEventListener('load', () => new Contact);