import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.css',
})
export class MenuListComponent implements OnInit {
  menus: any = [];
  constructor(private menuService: MenuService, private router: Router) {}
  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe((response) => {
      this.menus = response;
    });
  }

  goToEdit(id: string) {
    this.router.navigate(['/menu-edit', id]);
  }
}
