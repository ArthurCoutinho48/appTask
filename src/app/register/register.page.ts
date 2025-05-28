import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Usado para trabalhar com formulários reativos
import { Router } from '@angular/router'; // Usado para navegação entre páginas
import { LoadingController } from '@ionic/angular'; // Usado para exibir um loading (carregando)
import { AuthenticationService } from 'src/app/services/authentication.service'; // Serviço de autenticação personalizado

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  // Declaração do formulário de cadastro (será inicializado no ngOnInit)
  regForm!: FormGroup;

  // Injeção de dependências pelo construtor
  constructor(
    public formBuilder: FormBuilder,               // Criação do formulário reativo
    public loadingCtrl: LoadingController,         // Exibição de loading (Ionic)
    public authService: AuthenticationService,      // Serviço de autenticação Firebase
    public router: Router                          // Navegação entre páginas
  ) {}

  // Método que é chamado quando o componente é inicializado
  ngOnInit() {
    // Criação do formulário com validações
    this.regForm = this.formBuilder.group({
      fullname: ['', [
        Validators.required // Campo obrigatório
      ]],
      email: ['', [
        Validators.required, // Campo obrigatório
        Validators.email, // Formato de e-mail válido
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"), // Regex para validar e-mail
      ]],
      password: ['', [
        Validators.required, // Campo obrigatório
        Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}") // Senha com requisitos específicos
      ]],
    });
  }

  // Getter para facilitar o acesso aos controles do formulário no template
  get errorControl() {
    return this.regForm?.controls;
  }

  // Método chamado ao enviar o formulário de cadastro
  async signUp() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading'
    }); // Cria o loading
    await loading.present(); // Mostra o loading

    // Verifica se o formulário é válido
    if (this.regForm?.valid) {
      const user = await this.authService.registerUser(
        this.regForm.value.email, // Email do formulário
        this.regForm.value.password // Senha do formulário
      ).catch((erro) => {
        // Captura e exibe erros de registro
        console.log(erro);
        loading.dismiss(); // Fecha o loading
      });

      // Se o usuário foi criado com sucesso
      if (user) {
        loading.dismiss(); // Fecha o loading
        this.router.navigate(['/home']); // Redireciona para a página inicial
      } else {
        // Mensagem de erro (poderia ser exibida para o usuário)
        console.log('provide correct values');
      }
    }else{
      this.regForm.markAllAsTouched();
      loading.dismiss();
    }
  }

  // Getter para acesso direto ao campo fullname (útil no template)
  get fullname() {
    return this.regForm.get('fullname');
  }
}
