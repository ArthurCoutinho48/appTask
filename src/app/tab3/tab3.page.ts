import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service'; // Serviço para autenticação do usuário
import { TaskServiceService } from '../services/task-service.service'; // Serviço para manipulação das tarefas
import { Task } from '../class/task'; // Modelo da tarefa
import { IonModal, ModalController } from '@ionic/angular';
import { DisplayTaskPage } from '../display-task/display-task.page';

export class Day {
  public number: number = 0;
  public year: number = 0;
  public month: string = '';
  public monthIndex: number = 0;
  public weekDayName: string = '';
  public weekDayNumber: number = 0;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  @ViewChild(IonModal) modal!: IonModal; // Referência ao modal da interface para manipulação direta

  //Ano e mês atual
  currentYear: number;
  currentMonthIndex: number;

  // Dias do mês atual
  monthDays: Day[] = [];

  // Nomes dos dias da semana
  weekDaysName: string[] = [];

  userId: any;             // Armazena o ID do usuário autenticado
  tasks: Task[] = [];      // Lista de tarefas do usuário
  
  // Construtor: inicializa o ano e o mês atual com base na data do sistema
  constructor(
    private authService: AuthenticationService,     // Injeta o serviço de autenticação
    private taskService: TaskServiceService,         // Injeta o serviço de tarefas
    private modalCtrl: ModalController // Controlador de modal
  ) {
    let date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonthIndex = date.getMonth(); // valores de 0 (jan) a 11 (dez)
  }
  
  // Ao iniciar o componente, define os dias do mês atual e os nomes dos dias da semana
  ngOnInit() {
    this.setMonthDays(this.getMonth(this.currentMonthIndex, this.currentYear));
  
    this.weekDaysName = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // Ao iniciar a página, obtém o perfil do usuário autenticado
    this.authService.getProfile().then(user =>{
      this.userId = user?.uid; // Armazena o ID do usuário
      console.log(this.userId);

      this.loadTasksForCurrentMonth();
    })
  }
  
  getMonth(monthIndex: number, year: number): Day[] {
    let days: Day[] = [];
  
    // Obtém o número do dia da semana do primeiro dia do mês (0 = dom, 1 = seg, ..., 6 = sáb
    const firstDayWeekNumber = new Date(year, monthIndex, 1).getDay();
  
    // Adiciona dias "vazios" antes do primeiro dia do mês para alinhar a grade
    for (let i = 0; i < firstDayWeekNumber; i++) {
      days.push({} as Day); // ou crie um dia "em branco" com valores nulos
    }
  
    // Descobre quantos dias tem o mês
    const countDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  
    // Cria os objetos Day para cada dia real do mês
    for (let i = 1; i <= countDaysInMonth; i++) {
      days.push(this.createDay(i, monthIndex, year));
    }
  
    return days;
  }
  
  // Cria um objeto Day com todas as informações de uma data específica
  createDay(dayNumber: number, monthIndex: number, year: number): Day {
    let day = new Day();
  
    day.number = dayNumber;
    day.monthIndex = monthIndex;
    day.month = this.getMonthName(monthIndex);
    day.year = year;
  
    // Define o dia da semana (0 a 6) e seu nome
    day.weekDayNumber = new Date(year, monthIndex, dayNumber).getDay();
    day.weekDayName = this.getWeekDayName(day.weekDayNumber);
  
    return day;
  }
  
  // Retorna o nome do mês com base no índice (0 a 11)
  getMonthName(monthIndex: number): string {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      return months[monthIndex] || "";
  }
  
  // Retorna o nome do dia da semana com base no índice (0 a 6)
  getWeekDayName(weekDay: number): string {
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return weekDays[weekDay] || "";
  }
  
  // Define os dias do mês atual na tela
  setMonthDays(days: Day[]) {
    this.monthDays = days;
  
    // Se houver pelo menos um dia real (com número > 0), atualiza os dados atuais
    const firstValidDay = this.monthDays.find(day => day.number > 0);
    if (firstValidDay) {
      this.currentMonthIndex = firstValidDay.monthIndex;
      this.currentYear = firstValidDay.year;
    }
  }
  
  // Avança para o mês seguinte
  onNextMonth() {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
  
    this.setMonthDays(this.getMonth(this.currentMonthIndex, this.currentYear));
    this.loadTasksForCurrentMonth();
  }
  
  // Volta para o mês anterior
  onPreviousMonth() {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
        this.currentMonthIndex = 11;
        this.currentYear--;
    }
  
    this.setMonthDays(this.getMonth(this.currentMonthIndex, this.currentYear));
    this.loadTasksForCurrentMonth();
  }
  
  // Getter que retorna o nome do mês atual, usado no HTML
  get currentMonthName(): string {
    return this.getMonthName(this.currentMonthIndex);
  }

  loadTasksForCurrentMonth() {
    this.taskService.getTasks(this.userId).subscribe(res => {
      const selectedMonth = String(this.currentMonthIndex + 1).padStart(2, '0');
      const selectedYear = String(this.currentYear);

      this.tasks = res.filter((task) => {
        const [day, month, year] = task.createdAt.trim().split('/');
        return month === selectedMonth && year === selectedYear;
      });

      console.log('Tarefas do mês:', this.tasks);
    });
  }

  // Abre um modal com os detalhes de um diário específico
  async openTask(task: Task){
    const modal = await this.modalCtrl.create({
        component: DisplayTaskPage, // Componente modal a ser aberto
        componentProps: { id: task.id }, // Passa o ID do diário como propriedade
        breakpoints: [0, 0.6, 1.0], // Define os tamanhos possíveis do modal
        initialBreakpoint: 0.6 // Define o tamanho inicial do modal
    });
    await modal.present();
  }
}
