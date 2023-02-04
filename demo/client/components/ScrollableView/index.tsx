import React, { useEffect, useRef } from 'react';

import styles from './styles.module.css';
import { calcSnapPointsBlockEdges } from '../SliderV2/utils/helpers/calcSnapPointsBlockEdges';
import { StickyScrollExecutor } from '../SliderV2/utils/stickyScrollExecutor';

export const ScrollableView: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const slidesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const container = containerRef.current as HTMLDivElement;
        const list = scrollTrackRef.current as HTMLDivElement;
        const slides = slidesRef.current as HTMLDivElement[];

        const snapPoints = calcSnapPointsBlockEdges({
            container,
            list,
            slides,
        });

        const stickyScrollableView = new StickyScrollExecutor({
            containerNode: container,
            scrollableNode: list,
            snapPoints,
        });

        stickyScrollableView.addListener('SCROLL_END', () => {
            console.log('SCROLL_END');
        });

        stickyScrollableView.addListener('SWIPE', () => {
            console.log('SWIPE');
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
