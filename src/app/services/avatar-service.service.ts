import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service'; // Importa seu serviço de autenticação
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarServiceService {

  constructor(private authService: AuthenticationService) {}

  /**
   * Gera a URL da imagem de avatar com base na primeira letra do nome do usuário
   * @returns Promise<string> com a URL da imagem
   */
  async getAvatarUrl(): Promise<string> {
    try {
      const name = await this.authService.getUserName();
      const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';

      // Adiciona timestamp para forçar atualização da imagem no navegador
      const timestamp = new Date().getTime();
      const url = `https://ui-avatars.com/api/?name=${firstLetter}&background=1d1d1d&color=fff&size=128&v=${timestamp}`;

      return url;
    } catch (error) {
      return 'https://ui-avatars.com/api/?name=-&background=1d1d1d&color=fff&size=128';
    }
  }
}
