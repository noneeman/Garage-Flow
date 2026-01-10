import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gf-empty-state',
  standalone: true,
  template: `
    <div
      class="flex flex-col items-center justify-center rounded-gf-xl border border-dashed border-gf-border/90 bg-gf-elevated/40 px-6 py-16 text-center"
    >
      <div
        class="mb-5 flex h-14 w-14 items-center justify-center rounded-gf-xl border border-gf-border bg-gf-surface text-gf-accent shadow-gf-inset"
        aria-hidden="true"
      >
        <ng-content select="[icon]" />
      </div>
      <h3 class="font-display text-lg font-semibold tracking-tight text-gf-fg">{{ title() }}</h3>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-gf-fg-muted">{{ message() }}</p>
      @if (actionLabel()) {
        <button type="button" class="gf-btn-secondary mt-6 px-4 py-2 text-sm" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<void>();
}
