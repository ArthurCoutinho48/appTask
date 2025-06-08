import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'; // Serviço para autenticação do usuário
import { TaskServiceService } from '../services/task-service.service'; // Serviço para manipulação das tarefas 
import { Task } from '../class/task'; // Modelo da tarefa
import { IonModal, ModalController } from '@ionic/angular';
import { DisplayTaskPage } from '../display-task/display-task.page'; // Página do modal de tarefa

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit{
  @ViewChild(IonModal) modal!: IonModal; // Referência ao modal da interface para manipulação direta

  userId: any;             // Armazena o ID do usuário autenticado
  tasks: Task[] = [];      // Lista de tarefas do usuário

  constructor(
    private authService: AuthenticationService,     // Injeta o serviço de autenticação
    private taskService: TaskServiceService,         // Injeta o serviço de tarefas
    private modalCtrl: ModalController // Controlador de modal
  ) {}

  // Abre um modal com os detalhes de um diário específico
  async openTask(task: Task){
    const modal = await this.modalCtrl.create({
      component: DisplayTaskPage, // Componente modal a ser aberto
      componentProps: { id: task.id }, // Passa o ID do diário como propriedade
      breakpoints: [0, 0.6, 1.0], // Define os tamanhos possíveis do modal
      initialBreakpoint: 0.6 // Define o tamanho inicial do modal
    });
    await modal.present();
  }

  concTask(task: any){
    if(task.status == true){
      task.status = false;
      this.taskService.completedTask(task);
    }else if (task.status == false){
      task.status = true;
      this.taskService.completedTask(task);
    }
  }

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
