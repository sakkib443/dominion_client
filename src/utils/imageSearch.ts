/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;
let isLoading = false;

// Label to category mapping for product matching
const labelCategoryMap: Record<string, string[]> = {
    // Fashion
    'jersey': ['Fashion', 'clothing', 'shirt'],
    'dress': ['Fashion', 'clothing', 'dress'],
    'shirt': ['Fashion', 'clothing', 'shirt'],
    'suit': ['Fashion', 'clothing', 'formal'],
    'jean': ['Fashion', 'clothing', 'pants'],
    'sock': ['Fashion', 'clothing', 'accessories'],
    'coat': ['Fashion', 'clothing', 'jacket'],
    'cloak': ['Fashion', 'clothing', 'jacket'],
    'kimono': ['Fashion', 'clothing', 'dress'],
    'bikini': ['Fashion', 'clothing', 'swimwear'],
    'miniskirt': ['Fashion', 'clothing', 'skirt'],
    'stole': ['Fashion', 'clothing', 'accessories'],
    'pajama': ['Fashion', 'clothing', 'sleepwear'],
    'sweatshirt': ['Fashion', 'clothing', 'hoodie'],

    // Shoes
    'running shoe': ['Shoes', 'footwear', 'sneaker'],
    'shoe': ['Shoes', 'footwear'],
    'sandal': ['Shoes', 'footwear', 'sandal'],
    'boot': ['Shoes', 'footwear', 'boot'],
    'loafer': ['Shoes', 'footwear', 'formal'],
    'clog': ['Shoes', 'footwear'],
    'sneaker': ['Shoes', 'footwear', 'sneaker'],

    // Electronics
    'laptop': ['Electronics', 'computer', 'laptop'],
    'notebook': ['Electronics', 'computer', 'laptop'],
    'desktop computer': ['Electronics', 'computer', 'desktop'],
    'monitor': ['Electronics', 'computer', 'monitor'],
    'mouse': ['Electronics', 'computer', 'accessory'],
    'keyboard': ['Electronics', 'computer', 'accessory'],
    'cellular telephone': ['Electronics', 'phone', 'mobile'],
    'phone': ['Electronics', 'phone', 'mobile'],
    'smartphone': ['Electronics', 'phone', 'mobile'],
    'iPod': ['Electronics', 'audio', 'music'],
    'headphone': ['Electronics', 'audio', 'headphone'],
    'speaker': ['Electronics', 'audio', 'speaker'],
    'camera': ['Electronics', 'camera'],
    'television': ['Electronics', 'tv'],
    'remote control': ['Electronics', 'accessory'],
    'printer': ['Electronics', 'office'],

    // Accessories
    'sunglasses': ['Accessories', 'eyewear'],
    'watch': ['Accessories', 'watch'],
    'necklace': ['Accessories', 'jewelry'],
    'ring': ['Accessories', 'jewelry'],
    'bracelet': ['Accessories', 'jewelry'],
    'handbag': ['Accessories', 'bag'],
    'backpack': ['Accessories', 'bag'],
    'wallet': ['Accessories', 'wallet'],
    'umbrella': ['Accessories'],
    'tie': ['Accessories', 'fashion'],
    'bow tie': ['Accessories', 'fashion'],
    'cap': ['Accessories', 'hat'],
    'sombrero': ['Accessories', 'hat'],

    // Home
    'pillow': ['Home & Garden', 'bedding'],
    'lamp': ['Home & Garden', 'lighting'],
    'vase': ['Home & Garden', 'decor'],
    'clock': ['Home & Garden', 'decor'],
    'pot': ['Home & Garden', 'kitchen'],
    'cup': ['Home & Garden', 'kitchen'],
    'plate': ['Home & Garden', 'kitchen'],
    'table': ['Home & Garden', 'furniture'],
    'chair': ['Home & Garden', 'furniture'],
    'sofa': ['Home & Garden', 'furniture'],
    'bookcase': ['Home & Garden', 'furniture'],
};

export interface ImageSearchResult {
    labels: Array<{ className: string; probability: number }>;
    searchKeywords: string[];
    detectedCategory: string | null;
    dominantColors: string[];
}

// Load MobileNet model
export async function loadModel(): Promise<mobilenet.MobileNet> {
    if (model) return model;
    if (isLoading) {
        // Wait for model to finish loading
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return model!;
    }

    isLoading = true;
    try {
        await tf.ready();
        model = await mobilenet.load({ version: 2, alpha: 1.0 });
        console.log('MobileNet model loaded successfully');
        return model;
    } catch (error) {
        console.error('Failed to load MobileNet model:', error);
        throw error;
    } finally {
        isLoading = false;
    }
}

// Extract dominant colors from image using canvas
function extractDominantColors(imageElement: HTMLImageElement, numColors: number = 5): string[] {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    const size = 50; // Resize for speed
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(imageElement, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size).data;
    const colorMap: Record<string, number> = {};

    for (let i = 0; i < imageData.length; i += 16) { // Sample every 4th pixel
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        // Quantize colors to reduce uniqueness
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;

        const hex = `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    // Sort by frequency and return top colors
    return Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(([hex]) => hex);
}

// Convert hex to color name
function hexToColorName(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = (r + g + b) / 3;

    if (brightness < 40) return 'black';
    if (brightness > 220 && max - min < 30) return 'white';
    if (max - min < 20) return brightness > 128 ? 'light gray' : 'gray';

    if (r > g && r > b) {
        if (g > 150) return 'yellow';
        if (b > 150) return 'pink';
        return 'red';
    }
    if (g > r && g > b) {
        if (r > 150) return 'yellow';
        return 'green';
    }
    if (b > r && b > g) {
        if (r > 150) return 'purple';
        return 'blue';
    }

    return 'multicolor';
}

// Main image analysis function
export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageSearchResult> {
    const loadedModel = await loadModel();

    // Classify image
    const predictions = await loadedModel.classify(imageElement, 10);

    // Extract colors
    const dominantColors = extractDominantColors(imageElement);
    const colorNames = [...new Set(dominantColors.map(hexToColorName))];

    // Build search keywords from predictions
    const searchKeywords: string[] = [];
    let detectedCategory: string | null = null;

    for (const pred of predictions) {
        const className = pred.className.toLowerCase();
        const words = className.split(/[,\s]+/).filter(w => w.length > 2);

        for (const word of words) {
            if (!searchKeywords.includes(word)) {
                searchKeywords.push(word);
            }

            // Check category mapping
            for (const [label, categories] of Object.entries(labelCategoryMap)) {
                if (word.includes(label) || label.includes(word)) {
                    if (!detectedCategory) {
                        detectedCategory = categories[0];
                    }
                    categories.forEach(cat => {
                        if (!searchKeywords.includes(cat.toLowerCase())) {
                            searchKeywords.push(cat.toLowerCase());
                        }
                    });
                }
            }
        }
    }

    // Add color keywords
    colorNames.forEach(color => {
        if (!searchKeywords.includes(color)) {
            searchKeywords.push(color);
        }
    });

    return {
        labels: predictions.map(p => ({
            className: p.className,
            probability: p.probability,
        })),
        searchKeywords,
        detectedCategory,
        dominantColors: colorNames,
    };
}

// Create image element from file
export function createImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Score a product against search results
export function scoreProduct(product: any, searchResult: ImageSearchResult): number {
    let score = 0;
    const productText = `${product.name || ''} ${product.category || ''} ${product.description || ''} ${(product.tags || []).join(' ')}`.toLowerCase();

    // Category match (highest weight)
    if (searchResult.detectedCategory && product.category) {
        if (product.category.toLowerCase() === searchResult.detectedCategory.toLowerCase()) {
            score += 50;
        }
    }

    // Keyword matches
    for (const keyword of searchResult.searchKeywords) {
        if (productText.includes(keyword.toLowerCase())) {
            score += 10;
        }
    }

    // Label matches (AI predictions)
    for (const label of searchResult.labels) {
        const labelWords = label.className.toLowerCase().split(/[,\s]+/);
        for (const word of labelWords) {
            if (word.length > 2 && productText.includes(word)) {
                score += Math.round(label.probability * 20);
            }
        }
    }

    // Color match
    if (product.colors) {
        for (const color of searchResult.dominantColors) {
            if (product.colors.some((c: string) => c.toLowerCase().includes(color))) {
                score += 5;
            }
        }
    }

    return score;
}
