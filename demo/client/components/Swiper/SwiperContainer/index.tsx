import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { EmptyObject } from '../../../../../core/types/utils';

import { ISwiperConfig, ISwiperContainerProps } from '../types';
import { SwiperSlidesDataContext, SwiperMethodsContext } from '../context';
import { useSwiper } from '../hooks';

export function SwiperContainer<P extends EmptyObject>({
    children,
    className,
    paginator: Paginator,
    arrows: Arrows,
    ...config
}: PropsWithChildren<ISwiperContainerProps<P>>) {
    const { nodes, data, slidesData, methods, classNames } = useSwiper<P>(
        config as ISwiperConfig<P>,
    );

    return (
        <SwiperMethodsContext.Provider value={methods}>
            <SwiperSlidesDataContext.Provider value={slidesData}>
                <div
                    ref={nodes.container}
                    className={cn(className, classNames.containerClassName)}>
                    <div
                        ref={nodes.slidesList}
                        className={classNames.slidesListClassName}>
                        <div
                            ref={nodes.slidesTrack}
                            className={classNames.slidesTrackClassName}>
                            {children}
                        </div>
                    </div>
                    {Arrows && (
                        <Arrows
                            toNext={methods.toNext}
                            toPrevious={methods.toPrevious}
                        />
                    )}
                    {Paginator && (
                        <Paginator
                            currentIndex={data.currentIndex}
                            slidesCount={data.slidesCount}
                            setSlide={methods.setSlide}
                        />
                    )}
                </div>
            </SwiperSlidesDataContext.Provider>
        </SwiperMethodsContext.Provider>
    );
}
