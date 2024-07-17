import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from './side-bar/side-bar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FourOhFourComponent } from './components/error/four-oh-four/four-oh-four.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    SideBarComponent,
    NavBarComponent,
    FooterComponent,
    FourOhFourComponent,
    CommonModule,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  specialPage: boolean = false;
  constructor(private router: Router) {}
  title = 'angTest';
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.specialPage =
          this.router.url == '/monthly' || this.router.url === '/404';
      }
    });
  }
}
