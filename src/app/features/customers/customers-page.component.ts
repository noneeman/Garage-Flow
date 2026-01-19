import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GarageDataService } from '../../core/services/garage-data.service';
import type { Customer } from '../../core/models/garage.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent, workOrderStatusMeta } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'gf-customers-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './customers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPageComponent {
  readonly data = inject(GarageDataService);
  readonly woMeta = workOrderStatusMeta;

  readonly selectedId = signal<string | null>(this.data.customers()[0]?.id ?? null);

  readonly selected = computed(() => {
    const id = this.selectedId();
    return id ? this.data.customerById(id) ?? null : null;
  });

  readonly selectedStats = computed(() => {
    const c = this.selected();
    if (!c) return null;
    return {
      vehicles: this.data.vehiclesForCustomer(c.id).length,
      openRos: this.data.openWorkOrderCountForCustomer(c.id),
      invoiced: this.data.lifetimeInvoicedForCustomer(c.id),
      bookings: this.data.bookingsForCustomer(c.id).length,
    };
  });

  select(c: Customer): void {
    this.selectedId.set(c.id);
  }

  displayName(c: Customer): string {
    return c.companyName && c.companyName !== c.name ? c.companyName : c.name;
  }

  secondaryLine(c: Customer): string | null {
    if (c.companyName && c.companyName !== c.name) return c.name;
    return c.accountCode ?? null;
  }
}
