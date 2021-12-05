export class WheelScroll
{
    constructor(container: HTMLElement)
    {
        /** Max `scrollLeft` value */
        let scrollWidth;

        /** Desired scroll distance per animation frame */
        let getScrollStep = () => scrollWidth / 50;

        /** Target value for `scrollLeft` */
        let targetLeft;

        function scrollLeft()
        {
            let beforeLeft =    container.scrollLeft;
            let wantDx =        getScrollStep();
            let diff =          targetLeft - container.scrollLeft;
            let dX =            wantDx >= Math.abs(diff) ? diff : Math.sign(diff) * wantDx;

            // Peforming horizontal scroll
            container.scrollBy(dX, 0);

            // Break if target reached
            if (dX === diff)
                return;

            // Break if can't scroll anymore or target reached
            if (beforeLeft === container.scrollLeft || container.scrollLeft === targetLeft)
                return;

            requestAnimationFrame(scrollLeft);
        }

        container.addEventListener('wheel', e =>
        {
            e.preventDefault();

            scrollWidth = container.scrollWidth - container.clientWidth;
            targetLeft = Math.min(scrollWidth, Math.max(0, container.scrollLeft + e.deltaY));

            requestAnimationFrame(scrollLeft);
        });
    }
}