import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GarageDataService } from '../../core/services/garage-data.service';
import { BarChartComponent } from '../../shared/components/charts/bar-chart.component';
import { DonutChartComponent } from '../../shared/components/charts/donut-chart.component';
import { LineChartComponent } from '../../shared/components/charts/line-chart.component';

@Component({
  selector: 'gf-analytics-page',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, LineChartComponent, BarChartComponent, DonutChartComponent],
  templateUrl: './analytics-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent {
  readonly data = inject(GarageDataService);

  readonly revenueInsight = computed(() => {
    const r = this.data.revenueTrend();
    if (r.length < 2) return null;
    const cur = r[r.length - 1].value;
    const prev = r[r.length - 2].value;
    const delta = cur - prev;
    const pct = prev === 0 ? 0 : Math.round((100 * delta) / prev);
    return { cur, prev, delta, pct };
  });

  revenueLabels(): string[] {
    return this.data.revenueTrend().map((x) => x.label);
  }

  revenueValues(): number[] {
    return this.data.revenueTrend().map((x) => x.value);
  }

  servicesLabels(): string[] {
    return this.data.topServices().map((s) => s.service);
  }

  servicesValues(): number[] {
    return this.data.topServices().map((s) => s.count);
  }

  statusLabels(): string[] {
    return ['Booked', 'In progress', 'Awaiting parts', 'Awaiting approval', 'Ready', 'Completed'];
  }

  statusValues(): number[] {
    const j = this.data.analyticsSnapshot().jobsByStatus;
    return [j.booked, j.in_progress, j.waiting_parts, j.waiting_approval, j.ready, j.completed];
  }
}
