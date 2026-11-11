import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({
    src,
    alt,
    className = '',
    imgClassName = '',
    placeholderSrc = null,
    aspectRatio = 'aspect-video',
    bgClassName = 'bg-white',
    width,
    height,
    eager = false,
    fetchPriority = 'auto',
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(eager);
    const [isInView, setIsInView] = useState(eager);
    const imgRef = useRef(null);

    useEffect(() => {
        if (eager) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (imgRef.current) observer.unobserve(imgRef.current);
                }
            },
            { rootMargin: '150px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) observer.unobserve(imgRef.current);
        };
    }, [eager]);

    const isContain = className.includes('object-contain') || imgClassName.includes('object-contain');
    const objectFitClass = isContain ? 'object-contain' : 'object-cover';

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${bgClassName} ${aspectRatio ? aspectRatio : ''} ${className}`}>
            {!isLoaded && !eager && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-white to-slate-100" />
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={eager ? 'eager' : 'lazy'}
                    fetchpriority={eager ? 'high' : fetchPriority}
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ease-in-out ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imgClassName}`}
                    {...props}
                />
            )}
        </div>
    );
}
