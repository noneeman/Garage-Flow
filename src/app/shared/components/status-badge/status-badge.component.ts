import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { BookingStatus, InvoiceStatus, WorkOrderStatus } from '../../../core/models/garage.models';

export type BadgeTone = 'neutral' | 'accent' | 'warn' | 'danger' | 'ok' | 'info';

@Component({
  selector: 'gf-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[13px] font-semibold leading-tight tracking-tight"
      [ngClass]="hostClass()"
    >
      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('neutral');
  readonly extraClass = input('');

  readonly hostClass = computed(() => {
    const base = this.palette[this.tone()];
    const extra = this.extraClass();
    return extra ? `${base} ${extra}` : base;
  });

  private readonly palette: Record<BadgeTone, string> = {
    neutral: 'border-gf-border/90 bg-gf-subtle/90 text-gf-fg-muted',
    accent: 'border-gf-accent/25 bg-gf-accent/[0.11] text-gf-accent dark:bg-gf-accent/[0.14]',
    warn: 'border-gf-warn/22 bg-gf-warn/[0.1] text-gf-warn',
    danger: 'border-gf-danger/22 bg-gf-danger/[0.1] text-gf-danger',
    ok: 'border-gf-ok/22 bg-gf-ok/[0.1] text-gf-ok',
    info: 'border-gf-info/22 bg-gf-info/[0.1] text-gf-info',
  };
}

export function workOrderStatusMeta(
  status: WorkOrderStatus,
): { label: string; tone: BadgeTone } {
  const map: Record<WorkOrderStatus, { label: string; tone: BadgeTone }> = {
    booked: { label: 'Booked', tone: 'info' },
    in_progress: { label: 'In progress', tone: 'accent' },
    waiting_parts: { label: 'Awaiting parts', tone: 'warn' },
    waiting_approval: { label: 'Awaiting approval', tone: 'warn' },
    ready: { label: 'Ready for pickup', tone: 'ok' },
    completed: { label: 'Completed', tone: 'neutral' },
  };
  return map[status];
}

export function bookingStatusMeta(status: BookingStatus): { label: string; tone: BadgeTone } {
  const map: Record<BookingStatus, { label: string; tone: BadgeTone }> = {
    confirmed: { label: 'Confirmed', tone: 'ok' },
    waiting: { label: 'Waiting', tone: 'warn' },
    in_service: { label: 'In service', tone: 'accent' },
    no_show: { label: 'No-show', tone: 'danger' },
    completed: { label: 'Checked out', tone: 'neutral' },
  };
  return map[status];
}

export function invoiceStatusMeta(status: InvoiceStatus): { label: string; tone: BadgeTone } {
  const map: Record<InvoiceStatus, { label: string; tone: BadgeTone }> = {
    draft: { label: 'Draft', tone: 'neutral' },
    sent: { label: 'Sent', tone: 'info' },
    approved: { label: 'Approved', tone: 'accent' },
    paid: { label: 'Paid', tone: 'ok' },
    overdue: { label: 'Overdue', tone: 'danger' },
  };
  return map[status];
}

export function estimateStatusMeta(
  status: 'draft' | 'sent' | 'approved' | 'revised' | 'expired',
): { label: string; tone: BadgeTone } {
  const map: Record<string, { label: string; tone: BadgeTone }> = {
    draft: { label: 'Draft', tone: 'neutral' },
    sent: { label: 'Sent', tone: 'info' },
    approved: { label: 'Approved', tone: 'ok' },
    revised: { label: 'Revised', tone: 'warn' },
    expired: { label: 'Expired', tone: 'danger' },
  };
  return map[status];
}

export function paymentStatusMeta(
  status: 'unpaid' | 'partial' | 'paid',
): { label: string; tone: BadgeTone } {
  const map: Record<string, { label: string; tone: BadgeTone }> = {
    unpaid: { label: 'Unpaid', tone: 'warn' },
    partial: { label: 'Partial', tone: 'info' },
    paid: { label: 'Paid', tone: 'ok' },
  };
  return map[status];
}
