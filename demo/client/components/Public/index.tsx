import React, { PropsWithChildren } from 'react';

import { SnapPointSwiperPlugin, Swiper, Slide } from '../Swiper';
import styles from './styles.module.css';

import img1 from './assets/img1.jpeg';
import img2 from './assets/img2.jpeg';
import img3 from './assets/img3.jpeg';
import img4 from './assets/img4.jpeg';

export const Public: React.FC<PropsWithChildren> = () => {
    return (
        <div className={styles.container}>
            <Swiper
                plugin={SnapPointSwiperPlugin}
                centered
                className={styles.slidesWrapper}>
                <Slide
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
                </Slide>
                <Slide
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
                </Slide>
                <Slide
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
                </Slide>
                <Slide
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
                </Slide>
            </Swiper>
            <div className={styles.otherContent}>
                <div className={styles.block}></div>
                <div className={styles.block}></div>
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
