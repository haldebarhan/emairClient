import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Rapport } from '../../models/rapport';
import { ConsoService } from '../../services/conso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '../../../helpers/toast.helper';
import { UniteService } from '../unite/unite.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-conso-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conso-detail.component.html',
  styleUrl: './conso-detail.component.css',
})
export class ConsoDetailComponent implements OnInit {
  unites: any = [];
  consoReport!: Rapport;
  column: string[] = [];
  subColumn: string[] = ['M', 'M', 'S'];

  constructor(
    private readonly consoService: ConsoService,
    private router: Router,
    private uniteService: UniteService,
    private dataService: DataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.dataService.data$.subscribe({
      next: (value) => {
        this.consoReport = value;
        this.uniteService.getUnites().subscribe({
          next: (value) => {
            this.unites = value;
            this.consoReport.report.map((item) => {
              this.column.push(this.getUniteName(item.unite));
            });
          },
        });
      },
    });
  }

  formatDate(rapport: Rapport) {
    const date = new Date(rapport.date);
    const formatDate = date
      .toLocaleDateString('en-GB')
      .replace('/', '-')
      .replace('/', '-');
    return formatDate;
  }

  getUniteName(unite: string) {
    const find = this.unites.find((item: any) => item.id == unite);
    return find.nom;
  }

  goBack(){
    this.location.back()
  }
}
