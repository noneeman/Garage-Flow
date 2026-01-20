import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GarageDataService } from '../../core/services/garage-data.service';
import {
  StatusBadgeComponent,
  estimateStatusMeta,
  invoiceStatusMeta,
  paymentStatusMeta,
} from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'gf-estimates-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, StatusBadgeComponent],
  templateUrl: './estimates-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstimatesPageComponent {
  readonly data = inject(GarageDataService);
  readonly invMeta = invoiceStatusMeta;
  readonly payMeta = paymentStatusMeta;
  readonly estMeta = estimateStatusMeta;
}
