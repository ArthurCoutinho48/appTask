import { Injectable } from '@angular/core';
import { Task } from '../class/task';
import { AuthenticationService } from './authentication.service'; // Importa o serviço de autenticação personalizado
import { TaskServiceService } from './task-service.service';
import { Observable, from, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private taskService: TaskServiceService,
    private authService: AuthenticationService
  ) { }

   // Retorna o total de tarefas do usuário logado
  getTotalTasks(): Observable<number> {
    return from(this.authService.getProfile()).pipe(
      switchMap(user => {
        if (!user?.uid) throw new Error('Usuário não autenticado.');
        return this.taskService.getTasks(user.uid);
      }),
      map(tasks => tasks.length)
    );
  }

   // (opcional) tarefas concluídas
  getCompletedTasks(): Observable<number> {
    return from(this.authService.getProfile()).pipe(
      switchMap(user => {
        if (!user?.uid) throw new Error('Usuário não autenticado.');
        return this.taskService.getTasks(user.uid);
      }),
      map(tasks => tasks.filter(t => t.status === true).length)
    );
  }

  // (opcional) tarefas pendentes
  getPendingTasks(): Observable<number> {
    return from(this.authService.getProfile()).pipe(
      switchMap(user => {
        if (!user?.uid) throw new Error('Usuário não autenticado.');
        return this.taskService.getTasks(user.uid);
      }),
      map(tasks => tasks.filter(t => t.status === false).length)
    );
  }

  // Tarefas pendentes do dia atual
  getPendingTasksToday(): Observable<number> {
    const today = new Date();
    const formattedDate = this.formatDate(today); // exemplo: "19/06/2025"

    return from(this.authService.getProfile()).pipe(
      switchMap(user => {
        if (!user?.uid) throw new Error('Usuário não autenticado.');
        return this.taskService.getTasks(user.uid);
      }),
      map(tasks =>
        tasks.filter(t =>
          t.status === false && t.createdAt === formattedDate
        ).length
      )
    );
  }

  // Retorna o total de tarefas do dia atual (independente do status)
  getTasksToday(): Observable<number> {
    const today = new Date();
    const formattedDate = this.formatDate(today); // Exemplo: "19/06/2025"

    return from(this.authService.getProfile()).pipe(
      switchMap(user => {
        if (!user?.uid) throw new Error('Usuário não autenticado.');
        return this.taskService.getTasks(user.uid);
      }),
      map(tasks =>
        tasks.filter(t =>
          t.createdAt === formattedDate
        ).length
      )
    );
  }

  // Retorna a porcentagem de conclusão das tarefas criadas hoje
  getTodayCompletionPercentage(): Observable<number> {
    const today = new Date();
    const formattedDate = this.formatDate(today); // "19/06/2025"

    return from(this.authService.getProfile()).pipe(
      switchMap(user => {
        if (!user?.uid) throw new Error('Usuário não autenticado.');
        return this.taskService.getTasks(user.uid);
      }),
      map(tasks => {
        // Filtra tarefas com createdAt igual à data de hoje
        const todayTasks = tasks.filter(t => t.createdAt === formattedDate);

        const total = todayTasks.length;
        const completed = todayTasks.filter(t => t.status === true).length;

        if (total === 0) return 0;

        return Math.round((completed / total) * 100);
      })
    );
  }

  // Função auxiliar para formatar a data como "DD/MM/YYYY"
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
