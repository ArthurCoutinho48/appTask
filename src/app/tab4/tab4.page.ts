import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; // Importação do Ionic para mostrar loaders (carregamento visual)
import { AuthenticationService } from 'src/app/services/authentication.service'; // Importa o serviço de autenticação personalizado

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {

  // Declara uma variável para armazenar as informações do usuário
  user: any;

  constructor(
    public authService: AuthenticationService, 
    public router: Router) { 
      // Obtém o perfil do usuário a partir do serviço de autenticação ao inicializar a página
      this.user = authService.getProfile();
    }

  ngOnInit() {
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
