import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({
    src,
    alt,
    className = '',
    imgClassName = '',
    placeholderSrc = null,
    aspectRatio = 'aspect-video',
    bgClassName = 'bg-slate-100',
    width,
    height,
    eager = false,
    fetchPriority = 'auto',
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(eager);
    const [isInView, setIsInView] = useState(eager);
    const [hasError, setHasError] = useState(!src);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!src) {
            setHasError(true);
            return;
        }
        setHasError(false);
    }, [src]);

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
            {!isLoaded && !eager && !hasError && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
            )}
            {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                    <svg className="w-8 h-8 mb-1.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] font-medium text-slate-500">Yamaha Aspacindo</span>
                </div>
            ) : isInView && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={eager ? 'eager' : 'lazy'}
                    fetchpriority={eager ? 'high' : fetchPriority}
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setIsLoaded(true);
                    }}
                    ref={(node) => {
                        if (node && node.complete && node.naturalWidth > 0 && !isLoaded) {
                            setIsLoaded(true);
                        }
                    }}
                    className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ease-in-out ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imgClassName}`}
                    {...props}
                />
            )}
        </div>
    );
}
