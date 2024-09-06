import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RecetteService } from '../../../recette/recette.service';
import { ActivatedRoute, Router } from '@angular/router';
import { recette } from '../../../models/recette';

@Component({
  selector: 'app-recette-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recette-detail.component.html',
  styleUrl: './recette-detail.component.css',
})
export class RecetteDetailComponent implements OnInit {
  recette!: recette;
  dataId: string;
  constructor(
    private recetteService: RecetteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataId = this.route.snapshot.paramMap.get('id') ?? '';
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.recetteService.getOneRecette(this.dataId).subscribe({
      next: (response) => this.recette = response,
      error: (err) => console.log(err)
    });
  }


  getOutput(item: {
    denree: string;
    ration: number;
    unite: string;
  }) {
    let output = '';
    switch (item.unite) {
      case 'KG':
        output = `${item.ration}g`;
        break;
      case 'LITRE':
        output = `${item.ration}ml`;
        break;
      default:
        output = `1/${item.ration}`;
    }
    return output;
  }

  goBack(){
    this.router.navigate(['/recette-list'])
  }
}
