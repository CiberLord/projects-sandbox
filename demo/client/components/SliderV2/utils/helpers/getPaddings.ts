interface IPaddings {
    left: number;
    right: number;
}

export const getPaddings = (element: Element): IPaddings => {
    const styles = window.getComputedStyle(element);

    return {
        left: parseFloat(styles.paddingLeft),
        right: parseFloat(styles.paddingRight),
    };
};
