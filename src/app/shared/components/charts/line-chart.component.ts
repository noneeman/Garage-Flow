import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  runInInjectionContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ThemeService } from '../../../core/services/theme.service';
import { chartPalette } from '../../chart-theme';

Chart.register(...registerables);

@Component({
  selector: 'gf-line-chart',
  standalone: true,
  template: ` <div class="relative h-56 w-full"><canvas #c></canvas></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('c', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) values: number[] = [];
  @Input() label = 'Series';
  @Input() formatY: 'currency' | 'number' = 'number';

  private readonly injector = inject(Injector);
  private readonly theme = inject(ThemeService);
  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        void this.theme.themeRevision();
        this.chart?.destroy();
        this.build();
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['labels'] || changes['values'])) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.values;
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private build(): void {
    const p = chartPalette(this.theme.resolvedDark());

    const cfg: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            data: this.values,
            borderColor: p.accent,
            backgroundColor: p.accentFill,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => this.fmt(ctx.parsed.y ?? 0),
            },
          },
        },
        scales: {
          x: {
            grid: { color: p.grid },
            ticks: { color: p.tick, maxRotation: 0 },
          },
          y: {
            grid: { color: p.grid },
            ticks: {
              color: p.tick,
              callback: (value) => this.fmt(Number(value)),
            },
          },
        },
      },
    };

    this.chart?.destroy();
    this.chart = new Chart(this.canvas.nativeElement, cfg);
  }

  private fmt(n: number): string {
    if (this.formatY === 'currency') {
      return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
    }
    return `${n}`;
  }
}
