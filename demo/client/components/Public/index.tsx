import React, { PropsWithChildren } from 'react';
import classnames from 'classnames/bind';

import { IArrowProps } from '../SliderV2/types';
import { StickyScrollSliderModule, Slider, SliderSlide } from '../SliderV2';
import styles from './styles.module.css';

import img1 from './assets/img1.jpeg';
import img2 from './assets/img2.jpeg';
import img3 from './assets/img3.jpeg';
import img4 from './assets/img4.jpeg';
import { ScrollableView } from '../ScrollableView';

const cx = classnames.bind(styles);

const SLIDES_LIST = [img1, img2, img3, img4];

export const Arrows: React.FC<IArrowProps> = ({
    activePrevButton,
    activeNextButton,
    setNext,
    setPrev,
}) => {
    return (
        <div className={styles.arrowContainer}>
            <button
                onClick={setPrev}
                disabled={!activePrevButton}
                className={cx(styles.arrow, { activePrevButton })}>
                prev
            </button>
            <button
                onClick={setNext}
                disabled={!activeNextButton}
                className={cx(styles.arrow, { activeNextButton })}>
                next
            </button>
        </div>
    );
};

export const Public: React.FC<PropsWithChildren> = () => {
    return (
        <div className={styles.container}>
            <Slider
                module={StickyScrollSliderModule}
                arrows={Arrows}
                className={styles.slidesWrapper}>
                {SLIDES_LIST.map((image) => {
                    return (
                        <SliderSlide
                            key={image}
                            className={styles.slide}>
                            <img
                                className={styles.image}
                                src={image}
                            />
                            <button className={styles.button}>click</button>
                        </SliderSlide>
                    );
                })}
            </Slider>
            <div
                style={{
                    height: '400px',
                    background: 'yellow',
                }}>
                next block
            </div>
        </div>
    );
};
