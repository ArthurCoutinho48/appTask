import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'; // Serviço para autenticação do usuário
import { TaskServiceService } from '../services/task-service.service'; // Serviço para manipulação das tarefas 
import { Task } from '../class/task'; // Modelo da tarefa
import { IonModal, ModalController } from '@ionic/angular';
import { DisplayTaskPage } from '../display-task/display-task.page'; // Página do modal de tarefa
import { AvatarServiceService } from '../services/avatar-service.service';


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
  tasksToday: Task[] = [];
  avatarUrl: string = '';

  constructor(
    private authService: AuthenticationService,     // Injeta o serviço de autenticação
    private taskService: TaskServiceService,         // Injeta o serviço de tarefas
    private modalCtrl: ModalController, // Controlador de modal
    private avatarService: AvatarServiceService
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

    // Espera o modal ser fechado e recarrega a lista
    const { data } = await modal.onDidDismiss();

    if (data?.atualizada) {
      this.carregarTarefas(); // só recarrega se tiver atualizado algo
    }
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
    this.authService.getProfile().then(async user => {
      this.userId = user?.uid;

      this.taskService.getTodayAndPendingTasks().subscribe(res => {
        this.tasks = res;

        // Filtra apenas as tarefas do dia se precisar delas separadas
        const todayStr = this.formatDate(new Date());
        this.tasksToday = res.filter(t => t.createdAt === todayStr);
      });

      this.avatarUrl = await this.avatarService.getAvatarUrl();
    });
  }

  // Atualiza o avatar sempre que a aba é exibida
  async ionViewWillEnter() {
    const user = await this.authService.getProfile();
    this.userId = user?.uid;
    this.avatarUrl = await this.avatarService.getAvatarUrl();

    this.carregarTarefas(); // recarrega sempre que entrar na aba
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private carregarTarefas() {
    this.taskService.getTodayAndPendingTasks().subscribe(res => {
      this.tasks = res;

      const todayStr = this.formatDate(new Date());
      this.tasksToday = res.filter(t => t.createdAt === todayStr);
    });
  }

  
}
