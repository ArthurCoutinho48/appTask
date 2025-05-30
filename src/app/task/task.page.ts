import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from '../services/task-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {

  userId:any;
  title:string = '';
  date:any;
  content:string = '';

  constructor(
     private toastCtrl: ToastController,            // controlador de toasts
     private taskService: TaskServiceService, // serviço de diário
     private router: Router
  ) { }

  ngOnInit() {
  }

  // Adiciona um nova tarefa no Firestore
  async addTask(){

    if(this.title !== "" && this.content !== ""){
      this.taskService.addTask({
        userId: "", // será preenchido pelo serviço com o ID do usuário
        status: false, // status da tarefa
        title: this.title, // título do formulário
        createdAt: new Date(), // data atual
        content: this.content, // conteúdo do formulário
      }).then(async () => {
        // Mostra um toast de sucesso
        const toast = await this.toastCtrl.create({
          message: "Tarefa adicionada com sucesso!",
          duration: 1500
        });
        toast.present();

        this.title = '';
        this.date = '';
        this.content = '';

        // Aguarda o toast encerrar antes de redirecionar (opcional)
        toast.onDidDismiss().then(() => {
          this.router.navigate(['/tabs/tab2']); // <- substitua pelo caminho da sua página
        });
      }).catch(async (erro) => {
        // Mostra um toast de erro
        const toast = await this.toastCtrl.create({
          message: erro,
          duration: 2000
        });
        toast.present();
      });
    }else{
       const toast = this.toastCtrl.create({
          message: "Preencha os campos!",
          duration: 2000
        });
        (await toast).present();
    }
  }
}
