import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage({
    src,
    alt,
    className = '',
    imgClassName = '',
    placeholderSrc = null,
    aspectRatio = 'aspect-video',
    bgClassName = 'bg-white',
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (imgRef.current) observer.unobserve(imgRef.current);
                }
            },
            { rootMargin: '100px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) observer.unobserve(imgRef.current);
        };
    }, []);

    const isContain = className.includes('object-contain') || imgClassName.includes('object-contain');
    const objectFitClass = isContain ? 'object-contain' : 'object-cover';

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${bgClassName} ${aspectRatio ? aspectRatio : ''} ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-white to-slate-100" />
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className={`w-full h-full ${objectFitClass} transition-opacity duration-500 ease-in-out ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imgClassName}`}
                    {...props}
                />
            )}
        </div>
    );
}
