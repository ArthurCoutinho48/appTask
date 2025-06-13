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
      // Obtém o nome do usuário pelo serviço de autenticação
      const name = await this.authService.getUserName();

      // Extrai a primeira letra do nome ou usa "U" como padrão
      const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';

      // Monta a URL da API com a letra desejada
      const url = `https://ui-avatars.com/api/?name=${firstLetter}&background=1d1d1d&color=fff&size=128`;

      return url;
    } catch (error) {
      console.error('Erro ao gerar avatar:', error);
      // Retorna uma imagem padrão em caso de erro
      return 'https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff&size=128';
    }
  }
}
