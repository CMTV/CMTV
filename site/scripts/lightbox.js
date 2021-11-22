import PhotoSwipeLightbox from '/site/vendor/photoswipe/photoswipe-lightbox.esm.min.js';

let animDuration = 250;

const lightboxGallery = new PhotoSwipeLightbox({
    gallerySelector: '[data-pswp-gallery]',
    childSelector: 'a',
    showAnimationDuration: animDuration,
    hideAnimationDuration: animDuration,
    pswpModule: '/site/vendor/photoswipe/photoswipe.esm.min.js'
});

const lightboxSingle = new PhotoSwipeLightbox({
    gallerySelector: 'a[data-pswp-single]',
    showAnimationDuration: animDuration,
    hideAnimationDuration: animDuration,
    pswpModule: '/site/vendor/photoswipe/photoswipe.esm.min.js',
});

captionUI(lightboxGallery);
captionUI(lightboxSingle);

lightboxGallery.init();
lightboxSingle.init();

function captionUI(lightbox) {
    lightbox.on('afterSetContent', function (e) {
        let isInvertible = lightbox.pswp.currSlide.data.element.querySelector('img').classList.contains('invertible');

        if (isInvertible)
            e.slide.image.classList.add('_invert');
    });

    lightbox.on('uiRegister', function () {
        lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            onInit: (el) => {
                lightbox.pswp.on('change', () => {
                    const currSlideElement = lightbox.pswp.currSlide.data.element;
                    let captionHTML = currSlideElement.querySelector('img').getAttribute('alt');
                    el.innerHTML = captionHTML || '';
                    el.classList.toggle('_noCaption', !captionHTML);
                });
            }
        });
    });
}