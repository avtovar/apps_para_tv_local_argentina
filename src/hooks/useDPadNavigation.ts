"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export function useDPadNavigation() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());

  const register = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      elementsRef.current.set(id, element);
    } else {
      elementsRef.current.delete(id);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentElement = focusedId ? elementsRef.current.get(focusedId) : null;
    if (!currentElement) return;

    const rect = currentElement.getBoundingClientRect();
    let bestMatch: string | null = null;
    let minDistance = Infinity;

    // Arrow keys logic
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      elementsRef.current.forEach((el, id) => {
        if (id === focusedId) return;

        const targetRect = el.getBoundingClientRect();
        const dx = targetRect.left - rect.left;
        const dy = targetRect.top - rect.top;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Basic directional filtering
        let isCorrectDirection = false;
        if (e.key === 'ArrowUp' && targetRect.bottom <= rect.top) isCorrectDirection = true;
        if (e.key === 'ArrowDown' && targetRect.top >= rect.bottom) isCorrectDirection = true;
        if (e.key === 'ArrowLeft' && targetRect.right <= rect.left) isCorrectDirection = true;
        if (e.key === 'ArrowRight' && targetRect.left >= rect.right) isCorrectDirection = true;

        if (isCorrectDirection && distance < minDistance) {
          minDistance = distance;
          bestMatch = id;
        }
      });

      if (bestMatch) {
        setFocusedId(bestMatch);
        elementsRef.current.get(bestMatch)?.focus();
        e.preventDefault();
      }
    }

    if (e.key === 'Enter' && focusedId) {
      currentElement.click();
    }
  }, [focusedId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { focusedId, setFocusedId, register };
}
