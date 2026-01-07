import { Injectable, computed, signal } from '@angular/core';
import {
  activityFeed,
  bookings,
  customers,
  estimates,
  invoices,
  revenueTrend,
  shopKpis,
  techPerformance,
  technicians,
  topServices,
  vehicles,
  workloadSeries,
  workOrders,
} from '../data/mock-garage.data';
import type {
  Booking,
  Customer,
  Estimate,
  Invoice,
  Technician,
  Vehicle,
  WorkOrder,
  WorkOrderStatus,
} from '../models/garage.models';

@Injectable({ providedIn: 'root' })
export class GarageDataService {
  readonly technicians = signal<Technician[]>(technicians);
  readonly customers = signal<Customer[]>(customers);
  readonly vehicles = signal<Vehicle[]>(vehicles);
  readonly workOrders = signal<WorkOrder[]>(workOrders);
  readonly bookings = signal<Booking[]>(bookings);
  readonly invoices = signal<Invoice[]>(invoices);
  readonly estimates = signal<Estimate[]>(estimates);
  readonly activityFeed = signal(activityFeed);
  readonly shopKpis = signal(shopKpis);
  readonly workloadSeries = signal(workloadSeries);
  readonly revenueTrend = signal(revenueTrend);
  readonly topServices = signal(topServices);
  readonly techPerformance = signal(techPerformance);

  readonly analyticsSnapshot = computed(() => {
    const wo = this.workOrders();
    const byStatus = (s: WorkOrderStatus) => wo.filter((w) => w.status === s).length;
    const labor = wo.reduce((a, w) => a + w.subtotalLabor, 0);
    const parts = wo.reduce((a, w) => a + w.subtotalParts, 0);
    const approvedLines = wo.flatMap((w) => w.lines).filter((l) => l.approved);
    const pendingLines = wo.flatMap((w) => w.lines).filter((l) => !l.approved);
    const approvalRatePct =
      approvedLines.length + pendingLines.length === 0
        ? 100
        : Math.round((100 * approvedLines.length) / (approvedLines.length + pendingLines.length));
    const repeatCustomers = new Set(
      wo.map((w) => w.customerId),
    ).size;
    const turnaroundSample = [14.2, 11.8, 18.4, 15.0];
    const avgTurnaroundHrs =
      turnaroundSample.reduce((a, b) => a + b, 0) / turnaroundSample.length;
    return {
      jobsByStatus: {
        booked: byStatus('booked'),
        in_progress: byStatus('in_progress'),
        waiting_parts: byStatus('waiting_parts'),
        waiting_approval: byStatus('waiting_approval'),
        ready: byStatus('ready'),
        completed: byStatus('completed'),
      },
      partsVsLabor: { labor, parts },
      approvalRatePct,
      distinctCustomerAccounts: repeatCustomers,
      avgTurnaroundHrs,
    };
  });

  customerById(id: string): Customer | undefined {
    return this.customers().find((c) => c.id === id);
  }

  vehicleById(id: string): Vehicle | undefined {
    return this.vehicles().find((v) => v.id === id);
  }

  technicianById(id: string): Technician | undefined {
    return this.technicians().find((t) => t.id === id);
  }

  vehiclesForCustomer(customerId: string): Vehicle[] {
    return this.vehicles().filter((v) => v.customerId === customerId);
  }

  workOrdersForCustomer(customerId: string): WorkOrder[] {
    return this.workOrders().filter((w) => w.customerId === customerId);
  }

  invoicesForCustomer(customerId: string): Invoice[] {
    return this.invoices().filter((i) => i.customerId === customerId);
  }

  bookingsForCustomer(customerId: string): Booking[] {
    return this.bookings().filter((b) => b.customerId === customerId);
  }

  openWorkOrderCountForCustomer(customerId: string): number {
    const open: WorkOrderStatus[] = ['booked', 'in_progress', 'waiting_parts', 'waiting_approval', 'ready'];
    return this.workOrders().filter((w) => w.customerId === customerId && open.includes(w.status)).length;
  }

  lifetimeInvoicedForCustomer(customerId: string): number {
    return this.invoicesForCustomer(customerId).reduce((a, i) => a + i.total, 0);
  }
}
