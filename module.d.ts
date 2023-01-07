declare module '*.css' {
    interface IClassNames {
        [className: string]: string;
    }
    const styles: IClassNames;

    export = styles;
}

declare module '*.svg' {
    const value: any;
    export = value;
}

declare module '*.jpeg' {
    const value: string;
    export = value;
}

declare module '*.jpg' {
    const value: any;
    export = value;
}
