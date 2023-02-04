interface IOptions {
    container: HTMLDivElement;
    slides: HTMLDivElement[];
    centered?: boolean;
}

/*
    Вычисляет точки привязки для каждого слайда, без учета ширины скролла контейнера и ширины слайдов
*/
export const calcSnapPointsSafeEdges = ({ container, slides, centered }: IOptions): number[] => {
    const viewportWidth = container.getBoundingClientRect().width;

    return slides.map((slide) => {
        const slideWidth = slide.getBoundingClientRect().width;

        let position = slide.offsetLeft;

        if (centered) {
            position = position - (viewportWidth - slideWidth) / 2;
        }

        return position;
    });
};
