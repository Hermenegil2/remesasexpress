import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="app-container">
      <app-sidebar
        [expanded]="sidebarExpanded()"
        (toggleSidebar)="toggleSidebar()"
      />

      <div
        class="main-content flex flex-col"
        [class.sidebar-expanded]="sidebarExpanded()"
        [class.sidebar-collapsed]="!sidebarExpanded()"
      >
        <app-navbar (menuToggle)="toggleSidebar()" />

        <main class="flex-1 py-6">
          <div class="page-enter-active max-w-[1600px] mx-auto w-full">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  sidebarExpanded = signal(true);

  toggleSidebar() {
    this.sidebarExpanded.update(v => !v);
  }
}
