import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  path: string;
  icon: 'dash' | 'orders' | 'people' | 'cal' | 'chart' | 'doc';
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'gf-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgSwitch, NgSwitchCase],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly closeMobile = output<void>();

  readonly navGroups: NavGroup[] = [
    {
      label: 'Operations',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dash' },
        { label: 'Work orders', path: '/work-orders', icon: 'orders' },
        { label: 'Schedule', path: '/schedule', icon: 'cal' },
      ],
    },
    {
      label: 'Customers & billing',
      items: [
        { label: 'Customers & vehicles', path: '/customers', icon: 'people' },
        { label: 'Estimates & invoices', path: '/estimates', icon: 'doc' },
      ],
    },
    {
      label: 'Performance',
      items: [{ label: 'Analytics', path: '/analytics', icon: 'chart' }],
    },
  ];
}
