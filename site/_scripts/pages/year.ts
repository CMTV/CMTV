import { Toggler } from "../global/toggler";

window.addEventListener('load', () =>
{
    //
    // Переключение вкладок счетчиков
    //

    let counterTitle = document.querySelector('main > .counters > .counterTitle');
    let counters: Toggler[] = [];

    document.querySelectorAll('main > .counters > header > .counter').forEach(counterElem =>
    {
        let id =    counterElem.className.split(' ').pop().split('--').pop();
        let title = counterElem.getAttribute('title');
        let pane =  document.querySelector(`main > .counters > .details > .counterPane--${id}`);

        let toggler = new Toggler(counterElem, pane);
            toggler.clickCallback = () =>
            {
                counters.forEach(counter => counter.setState(false));
                return true;
            };
            toggler.changeCallback = (newState) =>
            {
                if (newState)
                    counterTitle.innerHTML = title;
            };

        counters.push(toggler);
    });

    //
    // Просмотр завершенных целей проекта
    //

    document.querySelectorAll('.counterPane--goal > .counterItem').forEach(elem =>
    {
        let projectElem = elem.querySelector('.project');
        let goalsElem = elem.querySelector('.goals');
    
        let toggler = new Toggler(projectElem, goalsElem);
            toggler.clickCallback = (event) =>
            {
                let target = event.target as Element;
                
                if (target.classList.contains('title') || target.classList.contains('icon') || target.parentElement.classList.contains('icon'))
                    return false;
    
                return true;
            };
            toggler.changeCallback = (newState) =>
            {
                projectElem.querySelector('.eyeContainer > i').className = 'fa-fw fa-solid fa-eye' + (newState ? '-slash' : '');
            };
    });
});