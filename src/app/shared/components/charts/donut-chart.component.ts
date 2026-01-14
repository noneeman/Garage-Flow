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
import { chartPalette, donutSegmentColors } from '../../chart-theme';

Chart.register(...registerables);

@Component({
  selector: 'gf-donut-chart',
  standalone: true,
  template: ` <div class="relative mx-auto h-52 w-52 max-w-full"><canvas #c></canvas></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('c', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) values: number[] = [];

  private readonly injector = inject(Injector);
  private readonly theme = inject(ThemeService);
  private chart?: Chart<'doughnut'>;

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
      this.chart.data.datasets[0].backgroundColor = this.labels.map((_, i) => this.segmentColors()[i % this.segmentColors().length]);
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private segmentColors(): string[] {
    return donutSegmentColors(this.theme.resolvedDark());
  }

  private build(): void {
    const dark = this.theme.resolvedDark();
    const p = chartPalette(dark);
    const colors = this.segmentColors();

    const cfg: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: this.labels.map((_, i) => colors[i % colors.length]),
            borderWidth: dark ? 1 : 0,
            borderColor: dark ? p.donutBorder : 'transparent',
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: p.tick,
              boxWidth: 10,
              font: { size: 11 },
            },
          },
        },
      },
    };

    this.chart?.destroy();
    this.chart = new Chart(this.canvas.nativeElement, cfg);
  }
}
