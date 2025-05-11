import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayTaskPageRoutingModule } from './display-task-routing.module';

import { DisplayTaskPage } from './display-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayTaskPageRoutingModule
  ],
  declarations: [DisplayTaskPage]
})
export class DisplayTaskPageModule {}
