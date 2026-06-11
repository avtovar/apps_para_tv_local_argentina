"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export interface NavElement {
  id: string;
  element: HTMLElement;
  group?: string;
}

export function useDPadNavigation() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const elementsRef = useRef<Map<string, NavElement>>(new Map());

  const register = useCallback((id: string, element: HTMLElement | null, group?: string) => {
    if (element) {
      elementsRef.current.set(id, { id, element, group });
    } else {
      elementsRef.current.delete(id);
    }
  }, []);

  const focusElement = useCallback((id: string) => {
    const navEl = elementsRef.current.get(id);
    if (navEl) {
      setFocusedId(id);
      navEl.element.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentNavEl = focusedId ? elementsRef.current.get(focusedId) : null;
    
    // If nothing is focused or the focused element is gone from DOM
    if (!currentNavEl || !document.body.contains(currentNavEl.element)) {
      if (elementsRef.current.size > 0) {
        // Try to find the best candidate to start with (e.g. first in a specific group or just the first)
        const firstId = elementsRef.current.keys().next().value;
        if (typeof firstId === 'string') focusElement(firstId);
      }
      return;
    }

    const rect = currentNavEl.element.getBoundingClientRect();
    let bestMatch: string | null = null;
    let minScore = Infinity;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      elementsRef.current.forEach((navEl, id) => {
        if (id === focusedId) return;
        if (!document.body.contains(navEl.element)) return;

        const targetRect = navEl.element.getBoundingClientRect();
        
        // Directional filtering
        let isCorrectDirection = false;
        let dPrimary = 0; // Distance in primary direction
        let dSecondary = 0; // Distance in secondary direction (misalignment)

        if (e.key === 'ArrowUp') {
          if (targetRect.bottom <= rect.top + 5) { 
            isCorrectDirection = true;
            dPrimary = rect.top - targetRect.bottom;
            dSecondary = Math.abs((targetRect.left + targetRect.right) / 2 - (rect.left + rect.right) / 2);
          }
        } else if (e.key === 'ArrowDown') {
          if (targetRect.top >= rect.bottom - 5) {
            isCorrectDirection = true;
            dPrimary = targetRect.top - rect.bottom;
            dSecondary = Math.abs((targetRect.left + targetRect.right) / 2 - (rect.left + rect.right) / 2);
          }
        } else if (e.key === 'ArrowLeft') {
          if (targetRect.right <= rect.left + 5) {
            isCorrectDirection = true;
            dPrimary = rect.left - targetRect.right;
            dSecondary = Math.abs((targetRect.top + targetRect.bottom) / 2 - (rect.top + rect.bottom) / 2);
          }
        } else if (e.key === 'ArrowRight') {
          if (targetRect.left >= rect.right - 5) {
            isCorrectDirection = true;
            dPrimary = targetRect.left - rect.right;
            dSecondary = Math.abs((targetRect.top + targetRect.bottom) / 2 - (rect.top + rect.bottom) / 2);
          }
        }

        if (isCorrectDirection) {
          // Score formula: primary distance + 3 * secondary distance
          // Higher multiplier for secondary distance to prefer strict alignment
          const score = dPrimary + (dSecondary * 3);
          
          // Group logic: prefer same group, but allow moving between them
          let groupBonus = 0;
          if (currentNavEl.group !== navEl.group) {
            groupBonus = 2000; // Large penalty for changing groups via arrows
          }
          
          if (score + groupBonus < minScore) {
            minScore = score + groupBonus;
            bestMatch = id;
          }
        }
      });

      if (bestMatch) {
        focusElement(bestMatch);
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // Handle "Back" action (Escape)
    if (e.key === 'Escape' || e.key === 'Backspace') {
      if (currentNavEl && currentNavEl.group !== 'sidebar') {
        // Try to focus something in the sidebar
        const sidebarEl = Array.from(elementsRef.current.values()).find(el => el.group === 'sidebar');
        if (sidebarEl) {
          focusElement(sidebarEl.id);
          e.preventDefault();
        }
      }
    }

    if (e.key === 'Enter' && focusedId) {
      // Small delay to allow focus styles to settle if needed
      currentNavEl.element.click();
    }
  }, [focusedId, focusElement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  return { focusedId, setFocusedId, register, focusElement };
}
