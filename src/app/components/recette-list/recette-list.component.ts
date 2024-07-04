import { Component, OnInit } from '@angular/core';
import { RecetteService } from '../../recette/recette.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recette-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recette-list.component.html',
  styleUrl: './recette-list.component.css',
})
export class RecetteListComponent implements OnInit {
  recettes: any = [];
  constructor(
    private readonly recetteService: RecetteService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getRecette();
  }

  getRecette() {
    this.recetteService.getAllRecette().subscribe((response) => {
      this.recettes = response;
    });
  }

  goToDetail(id: string) {
    this.router.navigate(['/recette-detail', id]);
  }

  goToEdit(id: string) {
    this.router.navigate(['/recette-edit', id]);
  }

  delete(id: string) {
    this.recetteService.deleteRecette(id).subscribe(() => {
      this.getRecette();
    });
  }
}
