import { Routes } from '@angular/router';
import { RecetteComponent } from './recette/recette.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecetteListComponent } from './components/recette-list/recette-list.component';
import { DenreeListComponent } from './components/denrees/denree-list/denree-list.component';
import { AddDenreeComponent } from './components/denrees/add-denree/add-denree.component';
import { EditDenreeComponent } from './components/denrees/edit-denree/edit-denree.component';

export const routes: Routes = [
    {
        path: '', component: DashboardComponent, pathMatch: 'full'
    },
    {
        path: 'recette-new', component: RecetteComponent
    },
    {
        path: 'recette-list', component: RecetteListComponent
    },
    {
        path: 'denree-list', component: DenreeListComponent
    },
    {
        path: 'denree-add', component: AddDenreeComponent
    },
    {
        path: 'denree-edit/:id', component: EditDenreeComponent
    }
];
