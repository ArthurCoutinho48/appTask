import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../class/task'; // Modelo da tarefa
import { TaskServiceService } from '../services/task-service.service';  // Serviço de manipulação de "Tarefa"
import { ModalController } from '@ionic/angular'; // Controlador de modal do Ionic



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
    private modalCtrl: ModalController
  ) { }

  // Método que será executado ao inicializar o componente
  ngOnInit() {

    // Recupera o journal com base no ID recebido via @Input e atribui ao objeto `journal`
    this.taskService.getTaskById(this.id).subscribe(res => {
      this.task = res;
    });
  }

  async deleteTask(){
    // Remove a tarefa com base no ID
    await this.taskService.removeJournal(this.id);

    // Fecha o modal após a exclusão
    this.modalCtrl.dismiss();
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
