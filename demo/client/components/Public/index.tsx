import React, { PropsWithChildren } from 'react';
import classnames from 'classnames/bind';

import { StickyMode, FreeScrollMode, Slider, SliderSlide } from '../SliderV3';
import { IArrowProps, IPaginationProps } from '../SliderV3/types';
import styles from './styles.module.css';

import img1 from './assets/img1.jpeg';
import img2 from './assets/img2.jpeg';
import img3 from './assets/img3.jpeg';
import img4 from './assets/img4.jpeg';

import img5 from './assets/img5.jpeg';
import img6 from './assets/img6.jpeg';
import img7 from './assets/img7.jpeg';
import img8 from './assets/img8.jpeg';
import img9 from './assets/img9.jpeg';

import img10 from './assets/img10.jpeg';
import img11 from './assets/img11.jpeg';
import img12 from './assets/img12.jpeg';
import img13 from './assets/img13.jpeg';
import img14 from './assets/img14.jpeg';

const cx = classnames.bind(styles);

const SLIDES_LIST = [
    img5,
    img13,
    img1,
    img6,
    img2,
    img10,
    img7,
    img11,
    img3,
    img14,
    img8,
    img4,
    img9,
    img12,
];

export const Pagination: React.FC<IPaginationProps> = ({
    slider,
    slidesCount,
    activeSlide,
    className,
}) => {
    const slides = slider.getSlides() || [];

    return (
        <div className={styles.paginationContainer}>
            {slides.map((slide, index) => {
                return (
                    <div
                        key={slide}
                        className={cx(styles.paginationItem, { isActive: activeSlide === index })}>
                        {index}
                    </div>
                );
            })}
        </div>
    );
};

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
                mode={FreeScrollMode}
                arrows={Arrows}
                pagination={Pagination}
                isUpdateOnResize
                className={styles.slidesWrapper}
                sliderScrollableClassName={styles.slides}>
                {SLIDES_LIST.map((image, index) => {
                    return (
                        <SliderSlide
                            key={index}
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
                    background: 'bisque',
                }}>
                next block
            </div>
        </div>
    );
};
