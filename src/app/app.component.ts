import { Component } from '@angular/core';
import { SideBarComponent } from './side-bar/side-bar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [SideBarComponent, NavBarComponent, FooterComponent],
})
export class AppComponent {
  constructor() {}
  title = 'angTest';
}
