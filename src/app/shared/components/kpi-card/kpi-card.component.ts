import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gf-kpi-card',
  standalone: true,
  template: `
    <div
      class="gf-card relative overflow-hidden p-5 transition-shadow duration-gf hover:shadow-gf sm:p-6"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gf-accent/35 to-transparent"
        aria-hidden="true"
      ></div>
      <p class="text-gf-kicker uppercase text-gf-fg-muted">{{ title() }}</p>
      <p
        class="mt-3 font-display text-[1.625rem] font-semibold tabular-nums tracking-tight text-gf-fg sm:text-[1.75rem]"
      >
        {{ value() }}
      </p>
      @if (hint()) {
        <p class="mt-2 text-xs leading-relaxed text-gf-fg-muted">{{ hint() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input<string | undefined>(undefined);
}
