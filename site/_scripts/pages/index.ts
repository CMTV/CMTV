import { WheelHorScroll } from "../includes/WheelHorScroll";

window.addEventListener('load', () =>
{
    new WheelHorScroll(document.querySelector('.life > .years'));
});