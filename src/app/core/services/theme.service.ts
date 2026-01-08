import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

const STORAGE_KEY = 'gf-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly mode = signal<'light' | 'dark' | 'system'>('system');

  /** Bumps when light/dark is applied so Chart.js widgets can redraw with matching colors. */
  readonly themeRevision = signal(0);

  readonly resolvedDark = computed(() => {
    const m = this.mode();
    if (m === 'dark') return true;
    if (m === 'light') return false;
    return this.prefersDark();
  });

  constructor() {
    const stored = this.doc.defaultView?.localStorage?.getItem(STORAGE_KEY) as
      | 'light'
      | 'dark'
      | 'system'
      | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      this.mode.set(stored);
    }
    this.apply();
    const mm = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    mm?.addEventListener('change', () => {
      if (this.mode() === 'system') this.apply();
    });
  }

  setMode(next: 'light' | 'dark' | 'system'): void {
    this.mode.set(next);
    this.doc.defaultView?.localStorage?.setItem(STORAGE_KEY, next);
    this.apply();
  }

  toggleLightDark(): void {
    const next = this.resolvedDark() ? 'light' : 'dark';
    this.setMode(next);
  }

  currentMode(): 'light' | 'dark' | 'system' {
    return this.mode();
  }

  private prefersDark(): boolean {
    return this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private apply(): void {
    const root = this.doc.documentElement;
    const next = this.resolvedDark();
    const before = root.classList.contains('dark');
    root.classList.toggle('dark', next);
    if (before !== next) {
      this.themeRevision.update((n) => n + 1);
    }
  }
}
