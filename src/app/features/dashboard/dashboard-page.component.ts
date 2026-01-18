import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GarageDataService } from '../../core/services/garage-data.service';
import type { ActivityEvent, WorkOrderStatus } from '../../core/models/garage.models';
import { BarChartComponent } from '../../shared/components/charts/bar-chart.component';
import { DonutChartComponent } from '../../shared/components/charts/donut-chart.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import {
  StatusBadgeComponent,
  workOrderStatusMeta,
} from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'gf-dashboard-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    RouterLink,
    KpiCardComponent,
    BarChartComponent,
    DonutChartComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  readonly data = inject(GarageDataService);

  readonly kpis = this.data.shopKpis;
  readonly workload = this.data.workloadSeries;
  readonly activity = this.data.activityFeed;

  readonly approvalQueue = computed(() =>
    this.data
      .workOrders()
      .filter((w) => w.status === 'waiting_approval' || w.approvalState === 'pending')
      .slice(0, 5),
  );

  readonly upcoming = computed(() => {
    const now = '2026-05-12T12:00:00';
    return this.data
      .bookings()
      .filter((b) => b.startsAt >= now && b.status !== 'completed' && b.status !== 'no_show')
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .slice(0, 5);
  });

  readonly workshopRows = computed(() => {
    const active = this.data.workOrders().filter((w) => w.status === 'in_progress' || w.status === 'waiting_parts');
    const bays = ['Bay 1', 'Bay 2', 'Bay 3', 'Diag'];
    return bays.map((bay) => {
      const wo = active.find((w) => w.bay === bay);
      return { bay, workOrder: wo };
    });
  });

  readonly workloadHeadline = computed(() => {
    const pts = this.workload();
    const last = pts[pts.length - 1]?.hours ?? 0;
    return `${last}h labour booked · Sat (short day)`;
  });

  workloadLabels(): string[] {
    return this.workload().map((w) => w.label);
  }

  workloadValues(): number[] {
    return this.workload().map((w) => w.hours);
  }

  statusMeta(status: WorkOrderStatus) {
    return workOrderStatusMeta(status);
  }

  customerName(id: string): string {
    return this.data.customerById(id)?.name ?? '—';
  }

  vehicleReg(id: string): string {
    return this.data.vehicleById(id)?.reg ?? '—';
  }

  techFirstName(technicianId: string): string {
    const n = this.data.technicianById(technicianId)?.name;
    return n?.split(/\s+/)[0] ?? '—';
  }

  activityIcon(kind: ActivityEvent['kind']): string {
    const map: Record<string, string> = {
      note: '—',
      status: '●',
      approval: '✓',
      parts: '▣',
      customer: '☎',
      system: '◆',
    };
    return map[kind] ?? '•';
  }

  statusDonutLabels(): string[] {
    return ['In progress', 'Awaiting parts', 'Awaiting approval', 'Ready', 'Booked'];
  }

  statusDonutValues(): number[] {
    const s = this.data.analyticsSnapshot().jobsByStatus;
    return [s.in_progress, s.waiting_parts, s.waiting_approval, s.ready, s.booked];
  }
}
