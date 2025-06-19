import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'; // Serviço para autenticação do usuário
import { AvatarServiceService } from '../services/avatar-service.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit{

  userId: any;             // Armazena o ID do usuário autenticado
  avatarUrl: string = '';

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  pendingToday: number = 0;
  tasksToday: number = 0;
  todayCompletionPercentage: number = 0;

  constructor(
    private authService: AuthenticationService,     // Injeta o serviço de autenticação
    private avatarService: AvatarServiceService,
    private dashboardService: DashboardService) {}


  ngOnInit() {
    // Ao iniciar a página, obtém o perfil do usuário autenticado
    this.authService.getProfile().then(async user =>{
      this.userId = user?.uid; // Armazena o ID do usuário
      console.log(this.userId);

      this.avatarUrl = await this.avatarService.getAvatarUrl();
    })

    this.dashboardService.getTotalTasks().subscribe({
      next: total => this.totalTasks = total,
      error: err => console.error(err)
    });

    this.dashboardService.getPendingTasks().subscribe({
      next: pending => this.pendingTasks = pending,
      error: err => console.error(err)
    });

    this.dashboardService.getPendingTasksToday().subscribe({
      next: today => this.pendingToday = today,
      error: err => console.error(err)
    });

    this.dashboardService.getTasksToday().subscribe({
      next: total => this.tasksToday = total,
      error: err => console.error(err)
    });

    this.dashboardService.getTodayCompletionPercentage().subscribe({
    next: percent => this.todayCompletionPercentage = percent,
    error: err => console.error(err)
  });
  }

}
