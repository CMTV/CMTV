let resizeTimeout;

let gradient: HTMLElement;
let gradientDiv: HTMLElement;

window.addEventListener('load', () =>
{
    gradient =      document.querySelector('.site > header .logo > .gradient');
    gradientDiv =   gradient.querySelector('div');

    adjustGradient();
});

function adjustGradient()
{
    let shiftX = gradient.getBoundingClientRect().left;
    gradientDiv.style.left = -shiftX + 'px';
}

window.addEventListener('resize', () =>
{
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustGradient, 100);
});