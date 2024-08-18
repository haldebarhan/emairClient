import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MagasinService } from '../../services/magasin.service';
import { Magasin } from '../../models/magasin';
import { map, startWith } from 'rxjs';
import { DenreeService } from '../denrees/denree.service';
import { Article } from '../../models/article';
import { NumberWithSpacesPipe } from '../../pipes/number-with-spaces.pipe';
import { ApproService } from '../../services/appro.service';
import { Sw } from '../../../helpers/sw.helper';
import { Toast } from '../../../helpers/toast.helper';
import { PdfGeneratorService } from '../../services/pdf-generator.service';

@Component({
  selector: 'app-appro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NumberWithSpacesPipe],
  templateUrl: './appro.component.html',
  styleUrl: './appro.component.css',
})
export class ApproComponent implements OnInit {
  magasinId: string | null = null;
  data!: Magasin;
  queryField: FormControl = new FormControl('', [Validators.required]);
  filteredOptions: any[] = [];
  mesures: any = [];
  denrees: any = [];
  approForm: FormGroup;
  userHasTyped = false;
  isDisable: boolean = true;
  shoppingCard: Article[] = [];
  isSubmited: boolean = false;
  constructor(
    private router: Router,
    private magService: MagasinService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private denreeService: DenreeService,
    private approService: ApproService,
    private pdfGenerator: PdfGeneratorService
  ) {
    this.approForm = this.fb.group({
      denree: this.queryField,
      date: new FormControl('', [Validators.required]),
      quantite: new FormControl('', [Validators.required]),
      um: new FormControl({ disabled: true, value: '' }, [Validators.required]),
      pu: new FormControl({ disabled: true, value: '' }, [Validators.required]),
      decompte: new FormControl({ disabled: true, value: '' }, [
        Validators.required,
      ]),
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.magasinId = params.get('id');
      if (this.magasinId) {
        this.magService.findOne(this.magasinId).subscribe({
          next: (result) => {
            this.data = result;
            this.reload();
            this.loadMesure();
            this.loadDenrees();
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  filter(query: string): any[] {
    return this.denrees.filter((item: any) =>
      item.product.toLowerCase().includes(query.toLowerCase())
    );
  }

  selectOption(option: any) {
    // const um = this.getSelectedOptionData(option);
    this.approForm.get('um')?.setValue(option.mesure);
    this.approForm.get('pu')?.setValue(option.pu);
    this.queryField.setValue(option.product);
    this.filteredOptions = [];
  }

  onUserInput() {
    this.userHasTyped = true;
  }

  reload() {
    this.queryField.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filter(value))
      )
      .subscribe((filteredOptions) => (this.filteredOptions = filteredOptions));

    this.approForm
      .get('quantite')
      ?.valueChanges.pipe(
        map((value) => {
          const prix: number = this.approForm.get('pu')?.value;
          return prix * value;
        })
      )
      .subscribe((value) => this.approForm.get('decompte')?.setValue(value));
  }

  loadMesure() {
    this.denreeService.getMesures().subscribe({
      next: (result) => {
        this.mesures = result;
      },
      error: (err) => console.log(err),
    });
  }

  loadDenrees() {
    this.denreeService.getAllDenree().subscribe({
      next: (result) => {
        this.denrees = result;
      },
    });
  }

  getSelectedOptionData(option: any): string {
    const result = this.mesures.find((item: any) => item.id == option.um);
    return result.mesure;
  }

  findShoppingCardItemsInfo(item: Article): any {
    const finded = this.denrees.find(
      (element: any) => element.product == item.produit
    );
    return finded;
  }

  submit() {
    const data: Article = {
      produit: this.approForm.value.denree,
      quantite: this.approForm.value.quantite,
      um: this.approForm.get('um')?.value,
      pu: this.approForm.get('pu')?.value,
      decompte: this.approForm.get('decompte')?.value,
    };
    this.addItem(data);
    this.cleanData();
  }

  Approvisionner() {
    this.isSubmited = true;
    const form_date = this.approForm.get('date')?.value;
    const date = new Date(form_date);
    const items = this.shoppingCard.map((item) => {
      const find = this.findShoppingCardItemsInfo(item);
      return {
        denree: find.id,
        quantite: item.quantite,
        denreeName: item.produit,
      };
    });
    if (this.magasinId) {
      const data = {
        date: date.toISOString(),
        magasin: this.magasinId,
        produits: items,
      };
      this.approService.makeAppro(data).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Action reussie',
            didClose: () => {
              this.isSubmited = false;
              this.shoppingCard = [];
              this.router.navigate(['/']);
            },
          });
        },
        error: (err) => {
          console.log(err);
          this.isSubmited = false
        },
      });
    }
  }

  cleanData() {
    this.queryField.setValue('');
    this.approForm.get('um')?.setValue('');
    this.approForm.get('pu')?.setValue('');
    this.approForm.get('quantite')?.setValue('');
    this.approForm.get('decompte')?.setValue('');
    this.userHasTyped = false;
  }

  getTotal() {
    var sum = 0;
    this.shoppingCard.map((item) => (sum += item.decompte));
    return sum;
  }

  addItem(newItem: Article) {
    const index = this.shoppingCard.findIndex(
      (item) => item.produit === newItem.produit
    );
    if (index !== -1) {
      this.shoppingCard[index].quantite += newItem.quantite;
      const quantite = this.shoppingCard[index].quantite;
      const pu = this.shoppingCard[index].pu;
      this.shoppingCard[index].decompte = quantite * pu;
    } else {
      this.shoppingCard.push(newItem);
    }
  }
}
