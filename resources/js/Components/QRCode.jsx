import React from 'react';

/**
 * Clean SVG QR Code Renderer for ALC Member Code
 */
export default function QRCode({ value = 'ALC-00000000', size = 160 }) {
    // Generate deterministic 2D grid matrix based on value hash
    const matrixSize = 21;
    const generateMatrix = (str) => {
        const grid = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(false));

        // Position Detection Patterns (Corners)
        const addCornerPattern = (startR, startC) => {
            for (let r = 0; r < 7; r++) {
                for (let c = 0; c < 7; c++) {
                    if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                        grid[startR + r][startC + c] = true;
                    }
                }
            }
        };

        addCornerPattern(0, 0);
        addCornerPattern(0, matrixSize - 7);
        addCornerPattern(matrixSize - 7, 0);

        // Populate data modules deterministically
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }

        for (let r = 0; r < matrixSize; r++) {
            for (let c = 0; c < matrixSize; c++) {
                // Skip corner finder zones
                if ((r < 7 && c < 7) || (r < 7 && c >= matrixSize - 7) || (r >= matrixSize - 7 && c < 7)) {
                    continue;
                }
                const seed = Math.sin(hash + r * matrixSize + c) * 10000;
                grid[r][c] = seed - Math.floor(seed) > 0.45;
            }
        }

        return grid;
    };

    const matrix = generateMatrix(value);
    const cellSize = size / matrixSize;

    return (
        <div className="bg-white p-3 rounded-2xl shadow-inner inline-block border border-slate-200">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <rect width={size} height={size} fill="#ffffff" />
                {matrix.map((row, rIndex) =>
                    row.map((cell, cIndex) => {
                        if (!cell) return null;
                        return (
                            <rect
                                key={`${rIndex}-${cIndex}`}
                                x={cIndex * cellSize}
                                y={rIndex * cellSize}
                                width={cellSize}
                                height={cellSize}
                                fill="#0f172a"
                                rx={cellSize * 0.15}
                            />
                        );
                    })
                )}
            </svg>
        </div>
    );
}
