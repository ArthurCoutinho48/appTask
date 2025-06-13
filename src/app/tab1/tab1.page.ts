import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'; // Serviço para autenticação do usuário
import { AvatarServiceService } from '../services/avatar-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit{

  userId: any;             // Armazena o ID do usuário autenticado
  avatarUrl: string = '';

  constructor(
    private authService: AuthenticationService,     // Injeta o serviço de autenticação
    private avatarService: AvatarServiceService) {}


  ngOnInit() {
    // Ao iniciar a página, obtém o perfil do usuário autenticado
    this.authService.getProfile().then(async user =>{
      this.userId = user?.uid; // Armazena o ID do usuário
      console.log(this.userId);

      this.avatarUrl = await this.avatarService.getAvatarUrl();
    })
  }

}
