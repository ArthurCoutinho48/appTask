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
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Injeta a instância do serviço de autenticação do Firebase
  constructor(public auth: Auth, private firestore: Firestore) { }

  /**
   * Registra um novo usuário com e-mail e senha
   * @param email - E-mail do usuário
   * @param password - Senha do usuário
   * @returns Promise com o resultado do cadastro
   */
  async registerUser(email: string, password: string, name: string) {
      try {
        // 1. Cria o usuário com e-mail e senha
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;

        // 2. Salva dados adicionais no Firestore (nome, data, etc.)
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, {
          uid: user.uid,
          email: email,
          name: name,
          createdAt: new Date()
        });

        console.log('Usuário registrado com sucesso:', user);
        return user;

      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw error;
      }
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

  /**
   * Busca o nome do usuário no Firestore pelo UID atual
   * @returns Promise<string> com o nome do usuário ou string vazia caso não encontre
   */
  async getUserName(): Promise<string> {
    // Obtém o usuário atualmente autenticado pelo Firebase Auth
    const user = this.auth.currentUser;

    // Se não houver usuário logado, retorna uma string vazia imediatamente
    if (!user) return '';

    try {
      // Cria uma referência para o documento do usuário no Firestore, usando o UID
      const userDocRef = doc(this.firestore, `users/${user.uid}`);

      // Faz a leitura (get) do documento do usuário no Firestore
      const userSnap = await getDoc(userDocRef);

      // Verifica se o documento existe
      if (userSnap.exists()) {
        // Obtém os dados do documento (objeto com os campos)
        const data = userSnap.data();

        // Retorna o campo 'name' do documento, ou string vazia se não existir
        return data['name'] || '';
      } else {
        // Se o documento não existir, retorna string vazia
        return '';
      }
    } catch (error) {
      // Em caso de erro, exibe no console para debug
      console.error('Erro ao buscar nome do usuário:', error);

      // Retorna string vazia para evitar quebra do app
      return '';
    }
  }
}
