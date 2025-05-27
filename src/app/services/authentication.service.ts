import { Injectable } from '@angular/core';
import {
  Auth,  // Serviço de autenticação principal
  createUserWithEmailAndPassword, // Função para registrar novo usuário
  signInWithEmailAndPassword, // Função para login
  sendPasswordResetEmail, // Função para enviar e-mail de redefinição de senha
  signOut, // Função para logout
  onAuthStateChanged, // Função para escutar mudanças no estado de autenticação
  User // Tipo de dado para o usuário autenticado
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Injeta a instância do serviço de autenticação do Firebase
  constructor(public auth: Auth) { }

  /**
   * Registra um novo usuário com e-mail e senha
   * @param email - E-mail do usuário
   * @param password - Senha do usuário
   * @returns Promise com o resultado do cadastro
   */
  async registerUser(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Realiza o login do usuário com e-mail e senha
   * @param email - E-mail do usuário
   * @param password - Senha do usuário
   * @returns Promise com o resultado do login
   */
  async loginUser(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Envia um e-mail para redefinir a senha
   * @param email - E-mail do usuário
   * @returns Promise com o resultado do envio
   */
  async resetPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Realiza o logout do usuário
   * @returns Promise do resultado da operação
   */
  async signOut() {
    return await signOut(this.auth);
  }

  /**
   * Obtém o usuário autenticado atual, se houver
   * @returns Promise que resolve com o usuário autenticado ou null
   */
  async getProfile() {
    return new Promise<User | null>((resolve, reject) => {
      onAuthStateChanged(this.auth, user => {
        if (user) {
          resolve(user as any); // retorna o usuário autenticado
        } else {
          resolve(null); // nenhum usuário logado
        }
      }, reject); // em caso de erro
    });
  }
}
