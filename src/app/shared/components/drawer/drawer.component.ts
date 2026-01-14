import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gf-drawer',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-40 bg-gf-fg/25 backdrop-blur-[3px] motion-reduce:backdrop-blur-none dark:bg-black/50"
        (click)="close.emit()"
        role="presentation"
      ></div>
    }
    <aside
      class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg transform border-l border-gf-border/90 bg-gf-surface shadow-gf motion-reduce:transition-none sm:max-w-xl lg:max-w-[min(42rem,100vw)] transition-transform duration-gf ease-out"
      [ngClass]="open() ? 'translate-x-0' : 'translate-x-full pointer-events-none'"
      [attr.aria-hidden]="!open()"
    >
      <div class="flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          class="shrink-0 border-b border-gf-border/90 bg-gf-elevated/50 px-5 py-4 sm:px-6 dark:bg-gf-elevated/30"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-gf-kicker uppercase text-gf-fg-muted">{{ eyebrow() }}</p>
              <h2 class="mt-1 font-display text-lg font-semibold tracking-tight text-gf-fg sm:text-xl">
                {{ title() }}
              </h2>
              @if (subtitle()) {
                <p class="mt-1.5 text-sm text-gf-fg-muted">{{ subtitle() }}</p>
              }
            </div>
            <button
              type="button"
              class="gf-focus mt-0.5 shrink-0 rounded-gf p-2 text-gf-fg-muted transition-colors hover:bg-gf-surface hover:text-gf-fg"
              (click)="close.emit()"
              aria-label="Close panel"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          <ng-content />
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly eyebrow = input('Details');
  readonly subtitle = input<string | undefined>(undefined);
  readonly close = output<void>();
}
