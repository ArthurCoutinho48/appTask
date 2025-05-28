import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; // Importação do Ionic para mostrar loaders (carregamento visual)
import { AuthenticationService } from 'src/app/services/authentication.service'; // Importa o serviço de autenticação personalizado

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {

  // Variável que armazena o e-mail do usuário (ligado ao input no template)
  email:any;

  constructor(
    public authService: AuthenticationService, // Serviço responsável pela lógica de resetar a senha
    public router: Router, // Serviço do Angular para navegação entre páginas
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  // Método assíncrono chamado quando o usuário solicita o reset de senha
  async resetPassword() {
    // Cria e exibe o loading
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading'
    });
    await loading.present();

    /*if (!this.email || this.email.trim() === '') {
      console.log('E-mail está vazio.');
    // aqui você pode exibir um alerta ou toast para o usuário
    return;
    }else{
      console.log('E-mail está preenchido.');
    }*/

    this.authService.resetPassword(this.email)   // Chama o método resetPassword passando o e-mail
      .then(async () => {
        
        await loading.dismiss();                 // Fecha o loading ANTES de navegar
        console.log('reset link sent');          // Exibe no console que o link foi enviado
        this.router.navigate(['/login']);        // Redireciona o usuário para a página de login
      })
      .catch((erro) => {
        console.log(erro);                       // Caso ocorra erro, exibe no console
      });
  }
}
