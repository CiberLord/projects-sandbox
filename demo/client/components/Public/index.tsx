import React, { PropsWithChildren, useEffect } from 'react';

import { SnapSliderModule, Slider, SliderSlide } from '../Slider';
import styles from './styles.module.css';

import img1 from './assets/img1.jpeg';
import img2 from './assets/img2.jpeg';
import img3 from './assets/img3.jpeg';
import img4 from './assets/img4.jpeg';
import { ISliderViewItemProps } from '../Slider/types';

const SimpleSliderView = ({ sliderInstance }: ISliderViewItemProps) => {
    console.log('render SimpleSliderView ');
    useEffect(() => {
        setTimeout(() => {
            sliderInstance.toNext(() => {
                console.log('changed');
            });
        }, 2000);
    }, []);
    return null;
};

const Views = [SimpleSliderView];

export const Public: React.FC<PropsWithChildren> = () => {
    return (
        <div className={styles.container}>
            <div className={styles.otherContent}>
                <div className={styles.block}>
                    <Slider
                        module={SnapSliderModule}
                        views={Views}
                        className={styles.slidesWrapper}>
                        <SliderSlide
                            key={'1'}
                            className={styles.slide}>
                            <img
                                className={styles.image}
                                src={img1}
                                alt={''}
                            />
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                        <SliderSlide
                            key={'2'}
                            className={styles.slide}>
                            <img
                                className={styles.image}
                                src={img2}
                                alt={''}
                            />
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                        <SliderSlide
                            key={'3'}
                            className={styles.slide}>
                            <img
                                className={styles.image}
                                src={img3}
                                alt={''}
                            />
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                        <SliderSlide
                            key={'4'}
                            className={styles.slide}>
                            <img
                                className={styles.image}
                                src={img4}
                                alt={''}
                            />
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                    </Slider>
                </div>
                <div className={styles.block}>
                    <Slider
                        module={SnapSliderModule}
                        className={styles.slidesWrapper}>
                        <SliderSlide
                            key={'1'}
                            className={styles.slide}>
                            <h1>title</h1>
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                        <SliderSlide
                            key={'2'}
                            className={styles.slide}>
                            <h1>title</h1>
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                        <SliderSlide
                            key={'3'}
                            className={styles.slide}>
                            <h1>title</h1>
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                        <SliderSlide
                            key={'4'}
                            className={styles.slide}>
                            <h1>title</h1>
                            <button
                                onClick={() => {
                                    console.log('hello world');
                                }}
                                className={styles.button}>
                                click
                            </button>
                        </SliderSlide>
                    </Slider>
                </div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
            </div>
        </div>
    );
};
