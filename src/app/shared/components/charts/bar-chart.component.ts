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
  selector: 'gf-bar-chart',
  standalone: true,
  template: ` <div class="relative h-56 w-full"><canvas #c></canvas></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('c', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) values: number[] = [];
  @Input() horizontal = false;

  private readonly injector = inject(Injector);
  private readonly theme = inject(ThemeService);
  private chart?: Chart<'bar'>;

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
    if (this.chart && (changes['labels'] || changes['values'] || changes['horizontal'])) {
      this.chart.destroy();
      this.build();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private build(): void {
    const p = chartPalette(this.theme.resolvedDark());

    const cfg: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: p.accentBar,
            borderRadius: 6,
            maxBarThickness: this.horizontal ? 18 : 28,
          },
        ],
      },
      options: {
        indexAxis: this.horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: !this.horizontal, color: p.grid },
            ticks: { color: p.tick, maxRotation: 0 },
          },
          y: {
            beginAtZero: true,
            grid: { color: p.grid },
            ticks: { color: p.tick },
          },
        },
      },
    };

    this.chart?.destroy();
    this.chart = new Chart(this.canvas.nativeElement, cfg);
  }
}
