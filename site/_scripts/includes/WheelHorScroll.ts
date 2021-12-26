export class WheelHorScroll
{
    constructor(container: HTMLElement)
    {
        if (!container) return;

        let scrollDuration = 175;
        let stopScrollDelay = 200;
        
        let pastX = 0;
        let remainsX = 0;
        
        let start, end;
        let animationId;

        let stopScrollTimeout;
        
        container.addEventListener('wheel', e =>
        {
            if (!WheelHorScroll.canScrollLeft(container, e.deltaY))
                if (stopScrollTimeout)
                {
                    resetStopScrollTimeout();
                    e.preventDefault();
                    return;
                }
                else return;
            
            e.preventDefault();
            
            pastX = 0;
            
            if (Math.sign(remainsX * e.deltaY) < 0)
                remainsX = 0;
            
            remainsX += e.deltaY;
            
            start = performance.now();
            end = start + scrollDuration;
            
            cancelAnimationFrame(animationId);
            scrollAnim();

            resetStopScrollTimeout();
        });
        
        function resetStopScrollTimeout()
        {
            clearTimeout(stopScrollTimeout);
            stopScrollTimeout = setTimeout(() => stopScrollTimeout = null, stopScrollDelay);
        }

        function scrollAnim()
        {
            let animProgress = (performance.now() - start) / (end - start);
                animProgress += 0.05; // Prevent zero step at animation start
                animProgress = Math.min(animProgress, 1);
            
            let step = (pastX + remainsX) * animProgress - pastX;
            container.scrollBy(step, 0);
            
            pastX += step;
            remainsX -= step;

            if (animProgress < 1)
                animationId = requestAnimationFrame(scrollAnim);
        }
    }
    
    static canScrollLeft(element: HTMLElement, direction: number)
    {
        let can = false;
        let initialSL = element.scrollLeft;
        
        element.scrollBy(direction, 0);
        if (Math.abs(element.scrollLeft - initialSL) > 1)
            can = true;
        
        element.scrollLeft = initialSL;
        
        return can;
    }
}