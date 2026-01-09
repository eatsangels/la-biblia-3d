import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const NarrativeVisuals = ({ book }: { book: string }) => {
    // Placeholder for future narrative objects (e.g., The Ark, Tablets, Cross)
    // currently we only have the LightPortal in UniverseCanvas which we could move here eventually
    return null;
};

export const BookTitleCard = ({ book, chapter }: { book: string, chapter: number }) => {
    // 3D Title Card that floats at the beginning of a chapter?
    // Or maybe this is better as a HUD element in KineticBible.
    return null;
};
