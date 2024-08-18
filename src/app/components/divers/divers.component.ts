import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DiversService } from '../../services/divers.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Divers } from '../../models/divers';
import { NumberWithSpacesPipe } from '../../pipes/number-with-spaces.pipe';

@Component({
  selector: 'app-divers',
  standalone: true,
  imports: [CommonModule, NumberWithSpacesPipe],
  templateUrl: './divers.component.html',
  styleUrl: './divers.component.css',
})
export class DiversComponent implements OnInit {
  @Input() magasinId!: string;
  divers: Divers[] = [];

  constructor(private diversService: DiversService, private router: Router) {}
  ngOnInit(): void {
    this.loadData()
  }

  newDivers() {
    this.router.navigate(['/divers-add']);
  }


  goToList(){
    this.router.navigate(['/divers-list'])
  }

  loadData(){
    this.diversService.filter(this.magasinId).subscribe({
      next: (value) => (this.divers = value),
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }
}
