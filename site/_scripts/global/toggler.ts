type ToggleClickCallback = (event: Event, toggler: Toggler) => boolean;
type ToggleStateChangeCallback = (newState: boolean, toggler: Toggler) => void;

export class Toggler
{
    button:         Element;
    target:         Element;

    clickCallback:  ToggleClickCallback;
    changeCallback: ToggleStateChangeCallback;

    state:      boolean;

    constructor(button: Element, target: Element)
    {
        this.button = button;
        this.target = target;

        if (this.button.hasAttribute('data-toggled') || this.target.hasAttribute('data-toggled'))
            this.setState(true, true);

        this.button.addEventListener('click', e =>
        {
            if (this.clickCallback)
                if (!this.clickCallback(e, this))
                    return;

            this.setState(!this.state);            
        });
    }

    setState(newState: boolean, silent = false)
    {
        this.state = newState;

        if (newState)   [this.button, this.target].forEach((elem) => elem.setAttribute('data-toggled', ''));
        else            [this.button, this.target].forEach((elem) => elem.removeAttribute('data-toggled'));

        if (!silent)
            if (this.changeCallback)
                this.changeCallback(this.state, this);
    }
}