export type WorkOrderStatus =
  | 'booked'
  | 'in_progress'
  | 'waiting_parts'
  | 'waiting_approval'
  | 'ready'
  | 'completed';

export type BookingStatus = 'confirmed' | 'waiting' | 'in_service' | 'no_show' | 'completed';

export type InvoiceStatus = 'draft' | 'sent' | 'approved' | 'paid' | 'overdue';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface Technician {
  id: string;
  name: string;
  initials: string;
  bay: string;
  shift: string;
  utilizationPct: number;
  activeJobs: number;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  accountCode?: string;
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'sms';
  notes?: string;
  tags: string[];
}

export interface Vehicle {
  id: string;
  customerId: string;
  reg: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  lastServiceDate: string;
  nextServiceDue?: string;
  warnings: string[];
}

export interface ServiceLine {
  id: string;
  code: string;
  description: string;
  type: 'labor' | 'parts' | 'sublet' | 'fee';
  qty: number;
  unitPrice: number;
  approved: boolean;
}

export type WorkOrderJobCategory = 'mechanical' | 'service' | 'diagnosis' | 'tyres' | 'fleet';

export type WorkOrderPriority = 'standard' | 'high' | 'rush';

export interface WorkOrder {
  id: string;
  roNumber: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  openedAt: string;
  promisedBy?: string;
  customerId: string;
  vehicleId: string;
  technicianId: string;
  advisor: string;
  bay?: string;
  mileageIn: number;
  concern: string;
  internalNotes: string;
  lines: ServiceLine[];
  approvalState: 'none' | 'pending' | 'approved' | 'declined';
  progress: { at: string; note: string; by: string }[];
  subtotalLabor: number;
  subtotalParts: number;
  tax: number;
  total: number;
  nextAction: string;
  jobCategory: WorkOrderJobCategory;
  partsEta?: string;
}

export type BookingArrival = 'drop_off' | 'while_you_wait' | 'collection';

export interface Booking {
  id: string;
  startsAt: string;
  endsAt: string;
  customerId: string;
  vehicleId: string;
  technicianId: string;
  bay: string;
  serviceType: string;
  status: BookingStatus;
  notes?: string;
  arrival?: BookingArrival;
}

export interface Invoice {
  id: string;
  workOrderId: string;
  customerId: string;
  number: string;
  issuedAt: string;
  dueAt: string;
  total: number;
  status: InvoiceStatus;
  payment: PaymentStatus;
}

export interface Estimate {
  id: string;
  customerId: string;
  vehicleId: string;
  title: string;
  sentAt: string;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'revised' | 'expired';
  validUntil: string;
}

export interface ActivityEvent {
  id: string;
  at: string;
  actor: string;
  kind: 'note' | 'status' | 'approval' | 'parts' | 'customer' | 'system';
  message: string;
  relatedRo?: string;
}

export interface ShopKpis {
  activeJobs: number;
  waitingApproval: number;
  todaysBookings: number;
  revenueWeek: number;
  avgRepairOrder: number;
  techUtilizationPct: number;
}

export interface WorkloadPoint {
  label: string;
  hours: number;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface ServiceMixItem {
  service: string;
  count: number;
}

export interface TechPerformance {
  technicianId: string;
  jobsClosedWeek: number;
  comebackRatePct: number;
  avgTurnaroundHrs: number;
  billedHours: number;
}
