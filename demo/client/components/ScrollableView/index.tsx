import React, { useEffect, useRef } from 'react';

import { scrollableContainerFactory } from '../Slider/libs/scrollableContainerFactory';

import styles from './styles.module.css';
import { getSnapPointsAccordingScrollWidth } from '../Slider/libs';
import { ScrollListeners } from '../Slider/libs/scrollableContainerFactory/types';
import { SnapScrollableViewInitializer } from '../Slider/libs/SnapScrollableViewInitializer';

export const ScrollableView: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const slidesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const container = containerRef.current as HTMLDivElement;
        const slidesTrack = scrollTrackRef.current as HTMLDivElement;
        const slides = slidesRef.current as HTMLDivElement[];

        const snapPoints = getSnapPointsAccordingScrollWidth({
            container,
            slidesTrack,
            slides,
        });

        const stickyScrollableView = new SnapScrollableViewInitializer({
            containerNode: container,
            scrollableNode: slidesTrack,
            snapPoints,
        });

        stickyScrollableView.addHandler(ScrollListeners.SCROLL_END, () => {
            console.log('scroll end');
        });

        return () => {
            stickyScrollableView.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={styles.container}>
            <div
                ref={scrollTrackRef}
                className={styles.scrollTrack}>
                {[0, 1, 2, 3, 4].map((value) => {
                    return (
                        <div
                            key={value}
                            ref={(el) => {
                                slidesRef.current.push(el as HTMLDivElement);
                            }}
                            className={styles.slide}></div>
                    );
                })}
            </div>
        </div>
    );
};
