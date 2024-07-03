import { Component, OnInit } from '@angular/core';
import { RecetteService } from '../../recette/recette.service';

@Component({
  selector: 'app-recette-list',
  standalone: true,
  imports: [],
  templateUrl: './recette-list.component.html',
  styleUrl: './recette-list.component.css',
})
export class RecetteListComponent implements OnInit {
  constructor(private readonly recetteService: RecetteService) {}
  ngOnInit(): void {
    this.getRecette()
  }

  getRecette() {
    this.recetteService.getAllRecette().subscribe(res => {
      console.log(res)
    })
  }
}
