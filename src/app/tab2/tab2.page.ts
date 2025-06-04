import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'; // Serviço para autenticação do usuário
import { TaskServiceService } from '../services/task-service.service'; // Serviço para manipulação das tarefas 
import { Task } from '../class/task'; // Modelo da tarefa

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit{

  userId: any;             // Armazena o ID do usuário autenticado
  tasks: Task[] = [];      // Lista de tarefas do usuário

  constructor(
    private authService: AuthenticationService,     // Injeta o serviço de autenticação
    private taskService: TaskServiceService         // Injeta o serviço de tarefas
  ) {}

  ngOnInit() {
    // Ao iniciar a página, obtém o perfil do usuário autenticado
    this.authService.getProfile().then(user =>{
      this.userId = user?.uid; // Armazena o ID do usuário
      console.log(this.userId);

      // Recupera as tarefas associadas a esse usuário
      this.taskService.getTasks(this.userId).subscribe(res =>{
        this.tasks = res; // Atualiza a lista de tarefas com o resultado recebido
        console.log(this.tasks);
      })
    })
  }
}
