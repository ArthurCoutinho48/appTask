import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular'; // Importação do Ionic para mostrar loaders (carregamento visual)
import { AuthenticationService } from 'src/app/services/authentication.service'; // Importa o serviço de autenticação personalizado
import { AvatarServiceService } from '../services/avatar-service.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {

  // Variável para armazenar apenas o nome do usuário
  userName: string = '';
  avatarUrl: string = '';
  userId: string | undefined;

  constructor(
    public authService: AuthenticationService, 
    public router: Router,
    private avatarService: AvatarServiceService,    
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) { 
  }

  // Atualiza o avatar sempre que a aba é exibida
  async ionViewWillEnter() {
    const user = await this.authService.getProfile();
    this.userId = user?.uid;
    this.avatarUrl = await this.avatarService.getAvatarUrl();
  }

  // Método chamado quando o componente for inicializado
  async ngOnInit() {

    // Busca o nome do usuário no Firestore usando o método criado
    this.userName = await this.authService.getUserName();

    this.avatarUrl = await this.avatarService.getAvatarUrl();
  }

  // Método assíncrono para realizar logout
  async logout() {
    // Chama o método signOut do serviço de autenticação
    this.authService.signOut().then(() => {
      // Se o logout for bem-sucedido, navega para a página de "landing"
      this.router.navigate(['/home']);
    });
  }
  
  async alterarSenha() {
    const user = await this.authService.getProfile();

    if (!user || !user.email) {
      const toast = await this.toastCtrl.create({
        message: 'Não foi possível obter seu e-mail. Faça login novamente.',
        duration: 2500,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      cssClass: 'meu-alerta-personalizado',
      header: 'Redefinir Senha',
      message: `Deseja enviar um e-mail de redefinição para: ${user.email}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: async () => {
            try {
              await this.authService.resetPassword(user.email!);

              const toast = await this.toastCtrl.create({
                message: 'E-mail de redefinição enviado!',
                duration: 2500
              });
              await toast.present();
            } catch (err) {
              const toast = await this.toastCtrl.create({
                message: 'Erro ao enviar o e-mail. Tente novamente.',
                duration: 2500,
                color: 'danger',
              });
              await toast.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async alterarNomeUsuario() {
    const alert = await this.alertCtrl.create({
      cssClass: 'meu-alerta-personalizado',
      header: 'Alterar nome de usuário',
      inputs: [
        {
          name: 'novoNome',
          type: 'text',
          placeholder: 'Digite seu novo nome',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            const novoNome = data.novoNome?.trim();
            if (!novoNome) {
              return false; // mantém o alerta aberto
            }

            try {
              await this.authService.updateUserName(novoNome);  // Atualiza no Firestore
              this.userName = novoNome;
              this.avatarUrl = await this.avatarService.getAvatarUrl(); // Atualiza o avatar
            } catch (error) {
              const toast = await this.toastCtrl.create({
                message: 'Erro ao alterar o nome. Tente novamente.',
                duration: 2000
              });
              await toast.present();
            }
            
            return true; // Permite que o alerta feche após salvar
          }
        }
      ]
    });

    await alert.present();
  }

}
