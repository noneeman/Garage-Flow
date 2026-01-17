import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GarageUiService } from '../../core/services/garage-ui.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'gf-top-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './top-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  readonly sidebarCollapsed = input(false);

  readonly toggleSidebar = output<void>();
  readonly openMobileNav = output<void>();

  constructor(
    readonly theme: ThemeService,
    readonly ui: GarageUiService,
  ) {}

  toggleTheme(): void {
    this.theme.toggleLightDark();
  }
}
