import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayTaskPage } from './display-task.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayTaskPageRoutingModule {}
