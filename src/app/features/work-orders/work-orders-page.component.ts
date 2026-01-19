import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GarageDataService } from '../../core/services/garage-data.service';
import { GarageUiService } from '../../core/services/garage-ui.service';
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '../../core/models/garage.models';
import { DrawerComponent } from '../../shared/components/drawer/drawer.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import {
  StatusBadgeComponent,
  workOrderStatusMeta,
} from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'gf-work-orders-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    FormsModule,
    DrawerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './work-orders-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrdersPageComponent {
  readonly data = inject(GarageDataService);
  readonly ui = inject(GarageUiService);

  readonly search = signal('');
  readonly status = signal<WorkOrderStatus | 'all'>('all');
  readonly priorityFilter = signal<WorkOrderPriority | 'all'>('all');
  readonly technicianId = signal<string | 'all'>('all');

  readonly statuses: (WorkOrderStatus | 'all')[] = [
    'all',
    'booked',
    'in_progress',
    'waiting_parts',
    'waiting_approval',
    'ready',
    'completed',
  ];

  readonly priorities: (WorkOrderPriority | 'all')[] = ['all', 'standard', 'high', 'rush'];

  readonly filtersActive = computed(() => {
    return (
      this.search().trim().length > 0 ||
      this.status() !== 'all' ||
      this.priorityFilter() !== 'all' ||
      this.technicianId() !== 'all' ||
      this.ui.globalSearch().trim().length > 0
    );
  });

  readonly filtered = computed(() => {
    const local = this.search().trim().toLowerCase();
    const global = this.ui.globalSearch().trim().toLowerCase();
    const q = [local, global].filter(Boolean).join(' ').trim();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const st = this.status();
    const pr = this.priorityFilter();
    const tech = this.technicianId();
    return this.data.workOrders().filter((wo) => {
      if (st !== 'all' && wo.status !== st) return false;
      if (pr !== 'all' && wo.priority !== pr) return false;
      if (tech !== 'all' && wo.technicianId !== tech) return false;
      if (tokens.length === 0) return true;
      const cust = this.data.customerById(wo.customerId)?.name.toLowerCase() ?? '';
      const reg = this.data.vehicleById(wo.vehicleId)?.reg.toLowerCase() ?? '';
      const hay = [
        wo.roNumber,
        cust,
        reg,
        wo.concern,
        wo.nextAction,
        wo.jobCategory,
        wo.internalNotes,
        wo.priority,
        wo.openedAt,
      ]
        .join(' ')
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  });

  readonly drawerOpen = signal(false);
  readonly selected = signal<WorkOrder | null>(null);
  readonly drawerTab = signal<'overview' | 'lines' | 'activity'>('overview');

  readonly drawerTabs: { id: 'overview' | 'lines' | 'activity'; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'lines', label: 'Lines' },
    { id: 'activity', label: 'Activity' },
  ];

  readonly drawerSubtitle = computed(() => {
    const wo = this.selected();
    if (!wo) return undefined;
    const c = this.data.customerById(wo.customerId)?.name ?? '';
    const r = this.data.vehicleById(wo.vehicleId)?.reg ?? '';
    return `${c} · ${r}`;
  });

  openDetail(wo: WorkOrder): void {
    this.selected.set(wo);
    this.drawerTab.set('overview');
    this.drawerOpen.set(true);
  }

  closeDetail(): void {
    this.drawerOpen.set(false);
  }

  setTab(tab: 'overview' | 'lines' | 'activity'): void {
    this.drawerTab.set(tab);
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set('all');
    this.priorityFilter.set('all');
    this.technicianId.set('all');
    this.ui.setGlobalSearch('');
  }

  statusMeta(status: WorkOrderStatus) {
    return workOrderStatusMeta(status);
  }

  approvalLabel(wo: WorkOrder): string {
    const map: Record<WorkOrder['approvalState'], string> = {
      none: 'No estimate',
      pending: 'Pending',
      approved: 'Approved',
      declined: 'Declined',
    };
    return map[wo.approvalState];
  }

  statusOptionLabel(s: WorkOrderStatus | 'all'): string {
    if (s === 'all') return 'All statuses';
    return workOrderStatusMeta(s).label;
  }

  priorityOptionLabel(p: WorkOrderPriority | 'all'): string {
    if (p === 'all') return 'All priorities';
    return this.priorityLabel(p);
  }

  priorityLabel(p: WorkOrderPriority): string {
    const map: Record<WorkOrderPriority, string> = {
      standard: 'Standard',
      high: 'High',
      rush: 'Rush',
    };
    return map[p];
  }

  priorityChipClass(p: WorkOrderPriority): string {
    const base =
      'inline-flex max-w-full rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide';
    const by: Record<WorkOrderPriority, string> = {
      standard: 'border-gf-border/90 bg-gf-subtle/70 text-gf-fg-muted',
      high: 'border-gf-warn/30 bg-gf-warn/[0.08] text-gf-warn',
      rush: 'border-gf-danger/30 bg-gf-danger/[0.08] text-gf-danger',
    };
    return `${base} ${by[p]}`;
  }

  jobCategoryLabel(cat: WorkOrder['jobCategory']): string {
    const map: Record<WorkOrder['jobCategory'], string> = {
      mechanical: 'Mechanical',
      service: 'Scheduled service',
      diagnosis: 'Diagnosis',
      tyres: 'Tyres',
      fleet: 'Fleet',
    };
    return map[cat];
  }

  workflowStep(wo: WorkOrder): number {
    switch (wo.status) {
      case 'booked':
        return 0;
      case 'in_progress':
        return 1;
      case 'waiting_parts':
      case 'waiting_approval':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  }

  readonly workflowLabels = ['Intake', 'Workshop', 'Parts / approvals', 'Ready'] as const;

  stepState(wo: WorkOrder, index: number): 'done' | 'current' | 'todo' {
    const w = this.workflowStep(wo);
    if (wo.status === 'completed') return 'done';
    if (index < w) return 'done';
    if (index === w) return 'current';
    return 'todo';
  }
}
