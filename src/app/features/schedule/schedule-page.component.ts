import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { Booking, BookingArrival } from '../../core/models/garage.models';
import { GarageDataService } from '../../core/services/garage-data.service';
import { DrawerComponent } from '../../shared/components/drawer/drawer.component';
import { StatusBadgeComponent, bookingStatusMeta } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'gf-schedule-page',
  standalone: true,
  imports: [DatePipe, DrawerComponent, StatusBadgeComponent],
  templateUrl: './schedule-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent {
  readonly data = inject(GarageDataService);

  readonly view = signal<'day' | 'week'>('day');
  private readonly scheduleDayKey = '2026-05-12';

  readonly dayBookings = computed(() => {
    const day = this.scheduleDayKey;
    return this.data
      .bookings()
      .filter((b) => b.startsAt.startsWith(day))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  });

  readonly daySummary = computed(() => {
    const list = this.dayBookings();
    const counts = (s: string) => list.filter((b) => b.status === s).length;
    return {
      total: list.length,
      confirmed: counts('confirmed'),
      inService: counts('in_service'),
      waiting: counts('waiting'),
      done: counts('completed'),
    };
  });

  readonly weekBookings = computed(() => {
    const days = ['2026-05-12', '2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16'];
    const map: Record<string, Booking[]> = {};
    for (const d of days) map[d] = [];
    for (const b of this.data.bookings()) {
      const d = b.startsAt.slice(0, 10);
      if (map[d]) map[d].push(b);
    }
    for (const d of days) map[d].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    return days.map((d) => ({ day: d, items: map[d] ?? [] }));
  });

  readonly drawerOpen = signal(false);
  readonly selected = signal<Booking | null>(null);

  open(b: Booking): void {
    this.selected.set(b);
    this.drawerOpen.set(true);
  }

  close(): void {
    this.drawerOpen.set(false);
  }

  bookingMeta = bookingStatusMeta;

  arrivalLabel(a?: BookingArrival): string | null {
    if (!a) return null;
    const map: Record<BookingArrival, string> = {
      drop_off: 'Drop-off',
      while_you_wait: 'While-you-wait',
      collection: 'Collection',
    };
    return map[a];
  }

  drawerSubtitle(): string | undefined {
    const b = this.selected();
    if (!b) return undefined;
    return `${this.data.vehicleById(b.vehicleId)?.reg ?? ''} · ${this.data.technicianById(b.technicianId)?.name ?? ''}`;
  }
}
