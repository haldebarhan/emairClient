import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UniteService } from '../unite.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './unite.component.html',
  styleUrl: './unite.component.css',
})
export class UniteComponent implements OnInit {
  unites: any = [];
  newItem: boolean = false;
  constructor(
    private readonly uniteService: UniteService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.laodData();
  }

  laodData() {
    this.uniteService.getUnites().subscribe((response) => {
      this.unites = response;
    });
  }

  create() {
    this.newItem = true;
  }

  goToEdit(uniteId: string) {
    this.router.navigate(['/unite-edit', uniteId]);
  }

  delete(id: string){
    this.uniteService.delete(id).subscribe((response)=> {
      console.log('ok')
    })
  }
}
