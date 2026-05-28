import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>('light');

  constructor() {
    const saved = localStorage.getItem('theme') as Theme | null;
    this.theme.set(saved || 'light');
    this.applyTheme(this.theme());

    effect(() => {
      this.applyTheme(this.theme());
      localStorage.setItem('theme', this.theme());
    });
  }

  toggle() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  private applyTheme(t: Theme) {
    document.body.classList.remove('light', 'dark', 'light-theme', 'dark-theme');
    document.body.classList.add(t, t === 'light' ? 'light-theme' : 'dark-theme');
  }
}
