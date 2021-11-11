import { Toggler } from "../global/toggler";

window.addEventListener('load', () =>
{
    document.querySelectorAll('main > .blocks > .block').forEach(blockElem =>
    {
        let button = blockElem.querySelector('header > .showBtn');
        let target = blockElem.querySelector('.contentContainer');

        let toggler = new Toggler(button, target);
            toggler.changeCallback = (newState) =>
            {
                let icon =  newState ? 'eye-slash' : 'eye';
                let title = newState ? 'Скрыть подробности' : 'Раскрыть подробности';
    
                button.querySelector('i').className = `fa-solid fa-${icon}`;
                button.setAttribute('title', title);
            }
    });
});