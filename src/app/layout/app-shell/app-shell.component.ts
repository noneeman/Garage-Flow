import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'gf-app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopBarComponent],
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  readonly sidebarCollapsed = signal(false);
  readonly mobileNavOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  openMobile(): void {
    this.mobileNavOpen.set(true);
  }

  closeMobile(): void {
    this.mobileNavOpen.set(false);
  }
}
