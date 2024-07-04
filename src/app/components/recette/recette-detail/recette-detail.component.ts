import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RecetteService } from '../../../recette/recette.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recette-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recette-detail.component.html',
  styleUrl: './recette-detail.component.css',
})
export class RecetteDetailComponent implements OnInit {
  recette: {id: string, nom: string, ingredients: Array<any>};
  dataId: string;
  constructor(
    private recetteService: RecetteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataId = this.route.snapshot.paramMap.get('id') ?? '';
    this.recette = {id: '', nom: '', ingredients: []}
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.recetteService.getOneRecette(this.dataId).subscribe((response: any) => {
      this.recette = response;
    });
  }

  goBack(){
    this.router.navigate(['/recette-list'])
  }
}
