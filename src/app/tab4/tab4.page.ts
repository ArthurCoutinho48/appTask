import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; // Importação do Ionic para mostrar loaders (carregamento visual)
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

  constructor(
    public authService: AuthenticationService, 
    public router: Router,
    private avatarService: AvatarServiceService) { 
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
    }).catch((erro) => {
      // Em caso de erro, exibe no console
      console.log(erro);
    });
  }

}
