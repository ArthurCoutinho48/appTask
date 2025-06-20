import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../class/task'; // Modelo da tarefa
import { TaskServiceService } from '../services/task-service.service';  // Serviço de manipulação de "Tarefa"
import { LoadingController, ModalController, ToastController } from '@ionic/angular'; // Controlador de modal do Ionic

@Component({
  selector: 'app-display-task',
  templateUrl: './display-task.page.html',
  styleUrls: ['./display-task.page.scss'],
  standalone: false,
})
export class DisplayTaskPage implements OnInit {
  // Decorador @Input permite receber dados de outro componente (no caso, o ID do journal)
  @Input() id:string = '';
  // Objeto que representará a tarefa carregado
  task: Task | undefined;
  date: string = '';

  constructor(
    private taskService: TaskServiceService, // Serviço para manipular a tarefa
    private toastCtrl: ToastController,      // Serviço para exibir notificações toast
    private modalCtrl: ModalController,     // Serviço para controlar o modal
    private loadingCtrl: LoadingController 
  ) { }

  // Método que será executado ao inicializar o componente
  ngOnInit() {

    // Recupera o journal com base no ID recebido via @Input e atribui ao objeto `journal`
    this.taskService.getTaskById(this.id).subscribe(res => {
      this.task = res;
    });
  }

  concTask(task: any){
    if(task.status == true){
      task.status = false;
      this.taskService.completedTask(task);
    }else if (task.status == false){
      task.status = true;
      this.taskService.completedTask(task);
    }

    // Fecha o modal após a atualização
    this.modalCtrl.dismiss();
  }

  // Método chamado ao atualizar uma tarefa
  async updateTask(){    
    // Atualiza a tarefa com os dados atuais
    this.taskService.updateTask(this.task!);

    // Cria e exibe uma notificação (toast) indicando que a tarefa foi atualizado
    const toast = await this.toastCtrl.create({
      message: 'Tarefa atualizada!',
      duration: 2000
    });
    toast.present();

    // Fecha o modal após a atualização
    this.modalCtrl.dismiss();
  }

  async deleteTask(){
    // Cria e exibe o loading
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading'
    });
    await loading.present();

    try {
      // Fecha o modal após a exclusão
      this.modalCtrl.dismiss();

      // Remove a tarefa com base no ID
      await this.taskService.removeJournal(this.id);
      
    } catch (error) {
      // Exibe toast de erro
      const toast = await this.toastCtrl.create({
        message: 'Erro ao excluir tarefa.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      // Fecha o loading em qualquer caso
      loading.dismiss();
    }
    
  }

  formatarData(event: any){
    let valor = event.detail.value;

    if (!valor) {
      this.date = '';
      return;
    }

    // Remove tudo que não for número
    valor = valor.replace(/\D/g, '');

    // Aplica a máscara manualmente
    if (valor.length > 2 && valor.length <= 4) {
      valor = valor.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    // Limita a 10 caracteres
    valor = valor.substring(0, 10);

    // Atualiza o model manualmente
    this.date = valor;

    // Reflete na UI
    const input = event.target as HTMLInputElement;
    input.value = valor;
  }

}
