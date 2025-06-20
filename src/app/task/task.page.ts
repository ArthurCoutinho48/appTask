import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from '../services/task-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';  // Importação do Ionic para mostrar loaders (carregamento visual)

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
     public loadingCtrl: LoadingController,         // Exibição de loading (Ionic)
     private taskService: TaskServiceService, // serviço de diário
     private router: Router
  ) { }

  ngOnInit() {
  }

  // Adiciona um nova tarefa no Firestore
  async addTask(){

    if(this.title !== "" && this.content !== ""){
      // Cria e exibe o loading
      const loading = await this.loadingCtrl.create({
        cssClass: 'custom-loading'
      });
      await loading.present();

      this.taskService.addTask({
        userId: "", // será preenchido pelo serviço com o ID do usuário
        status: false, // status da tarefa
        title: this.title, // título do formulário
        createdAt: this.date, // data atual
        content: this.content, // conteúdo do formulário
      }).then(async () => {
        this.title = '';
        this.date = '';
        this.content = '';

        this.router.navigate(['/tabs/tab2']).then(() => {
          // Espera a página carregar completamente e fecha o loading
          loading.dismiss();
        });
      }).catch(async (erro) => {
        loading.dismiss();
        
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
