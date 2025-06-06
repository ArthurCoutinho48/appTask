import { Injectable } from '@angular/core';
import { Task } from '../class/task';
import { AuthenticationService } from './authentication.service'; // Importa o serviço de autenticação personalizado
import {
  addDoc,          // adiciona um novo documento a uma coleção
  collection,      // referência a uma coleção
  collectionData,  // observa os dados de uma coleção como um Observable
  deleteDoc,       // deleta um documento
  doc,             // referência a um documento específico
  docData,         // observa os dados de um documento como um Observable
  Firestore,       // tipo principal para acessar o Firestore
  query,           // cria uma consulta
  updateDoc,       // atualiza campos de um documento
  where            // cria cláusulas de filtro para queries
} from '@angular/fire/firestore';
import { Observable } from 'rxjs'; // Importa o tipo Observable do RxJS, usado para reatividade

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(
    private authService: AuthenticationService,
    private firestore: Firestore
  ) { }

  // Método para adicionar uma nova tarefa
  async addTask(task: Task){
    const user = await this.authService.getProfile(); // obtém o usuário autenticado
    if (!user?.uid) throw new Error('Usuário não autenticado.'); // verifica se o usuário está logado
    task.userId = user.uid; // define o ID do usuário no diário

    const taskRef = collection(this.firestore, "tasks") // referência à coleção "tasks"
    return addDoc(taskRef, task); // adiciona o diário ao Firestore
  }

  // Retorna todos as tarefas de um determinado usuário (relação 1:N)
  getTasks(userId: any): Observable<Task[]>{
    const taskRef = collection(this.firestore, "tasks"); // Referência à coleção
    const refquery = query(taskRef, where('userId', '==', userId)); // Consulta filtrando por userId

    return collectionData(refquery, {idField:'id'}) as Observable <Task[]>; // Retorna os dados como array reativo
  }

  // Retorna uma tarefa específico pelo ID (consulta 1:1)
  getTaskById(id:any): Observable<Task>{
    const taskRef = doc(this.firestore, `tasks/${id}`); //  Referência à coleção
    return docData(taskRef, {idField: 'id'}) as Observable<Task>; // Retorna a tarefa como Observable
  }

  // Remove um diário pelo ID
  removeJournal(id:any){
    const taskRef = doc(this.firestore, `tasks/${id}`); // Referência ao documento
    return deleteDoc(taskRef); // Exclui o documento do Firestore
  }
}
