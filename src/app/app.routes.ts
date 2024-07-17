import { Routes } from '@angular/router';
import { RecetteComponent } from './recette/recette.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecetteListComponent } from './components/recette-list/recette-list.component';
import { DenreeListComponent } from './components/denrees/denree-list/denree-list.component';
import { AddDenreeComponent } from './components/denrees/add-denree/add-denree.component';
import { RecetteDetailComponent } from './components/recette/recette-detail/recette-detail.component';
import { RecetteEditComponent } from './components/recette/recette-edit/recette-edit.component';
import { MenuListComponent } from './components/menu/menu-list/menu-list.component';
import { MenuFormComponent } from './components/menu/menu-form/menu-form.component';
import { UniteComponent } from './components/unite/unite/unite.component';
import { UniteFormComponent } from './components/unite/unite-form/unite-form.component';
import { FourOhFourComponent } from './components/error/four-oh-four/four-oh-four.component';
import { MagasinComponent } from './components/magasin/magasin.component';
import { ApproComponent } from './components/appro/appro.component';
import { ConsoReportComponent } from './components/conso-report/conso-report.component';
import { ConsoEditComponent } from './components/conso-edit/conso-edit.component';
import { ConsoDetailComponent } from './components/conso-detail/conso-detail.component';
import { SurprimesFormComponent } from './components/surprimes-form/surprimes-form.component';
import { SurprimesListComponent } from './components/surprimes-list/surprimes-list.component';
import { DiversFormComponent } from './components/divers-form/divers-form.component';
import { DiversListComponent } from './components/divers-list/divers-list.component';
import { MonthlyTableComponent } from './components/monthly-table/monthly-table.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: 'recette-new',
    component: RecetteComponent,
  },
  {
    path: 'recette-list',
    component: RecetteListComponent,
  },
  {
    path: 'recette-detail/:id',
    component: RecetteDetailComponent,
  },
  {
    path: 'recette-edit/:id',
    component: RecetteEditComponent,
  },
  {
    path: 'denree-list',
    component: DenreeListComponent,
  },
  {
    path: 'denree-add',
    component: AddDenreeComponent,
  },
  {
    path: 'denree-edit/:id',
    component: AddDenreeComponent,
  },
  {
    path: 'menu-list',
    component: MenuListComponent,
  },
  {
    path: 'menu-add',
    component: MenuFormComponent,
  },
  {
    path: 'menu-edit/:id',
    component: MenuFormComponent,
  },
  {
    path: 'unite',
    component: UniteComponent,
  },
  {
    path: 'unite-new',
    component: UniteFormComponent,
  },
  {
    path: 'unite-edit/:id',
    component: UniteFormComponent,
  },
  {
    path: 'magasin',
    component: MagasinComponent,
  },
  {
    path: 'appro/:id',
    component: ApproComponent,
  },
  {
    path: 'report-conso',
    component: ConsoReportComponent,
  },
  {
    path: 'conso-edit/:id',
    component: ConsoEditComponent,
  },
  {
    path: 'conso-detail',
    component: ConsoDetailComponent,
  },
  {
    path: 'surprime-add',
    component: SurprimesFormComponent,
  },
  {
    path: 'surprime-edit/:id',
    component: SurprimesFormComponent,
  },
  {
    path: 'surprime-list',
    component: SurprimesListComponent,
  },
  { path: 'divers-add', component: DiversFormComponent },
  { path: 'divers-edit/:id', component: DiversFormComponent },
  {
    path: 'divers-list',
    component: DiversListComponent
  },
  {
    path: 'monthly', component: MonthlyTableComponent
  },
  {
    path: '404', component: FourOhFourComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  },
];
