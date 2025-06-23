import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para trabalhar com formulários reativos
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';  // Importação do Ionic para mostrar loaders (carregamento visual)
import { AuthenticationService } from 'src/app/services/authentication.service'; // Serviço personalizado de autenticação com Firebase

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  // Declaração do formulário de login (será inicializado no ngOnInit)
  loginForm!: FormGroup;

  // Injeção de dependências pelo construtor
  constructor(
    public formBuilder: FormBuilder,               // Criação do formulário reativo
    public loadingCtrl: LoadingController,         // Exibição de loading (Ionic)
    public authService: AuthenticationService,      // Serviço de autenticação Firebase
    public router: Router                          // Navegação entre páginas
  ) {}

  // Método chamado assim que o componente é carregado
  ngOnInit() {
    // Criação do formulário com validações
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,                       // Campo obrigatório
        Validators.email,                          // Valida formato de e-mail
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"), // Regex para garantir formato válido
      ]],
      password: ['', [
        Validators.required,                       // Campo obrigatório
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}") 
        // Regex que exige: 1 número, 1 letra minúscula, 1 letra maiúscula e pelo menos 8 caracteres
      ]],
    });
  }

  // Getter para facilitar o acesso aos controles do formulário no template HTML
  get errorControl() {
    return this.loginForm?.controls;
  }

  // Função executada ao tentar fazer login
  async login() {
    // Cria e exibe o loading
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading'
    });
    await loading.present();

    // Verifica se o formulário é válido
    if (this.loginForm?.valid) {

      try{
        // Tenta fazer login com os dados do formulário
        const user = await this.authService.loginUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        loading.dismiss();

        if (user) {
          this.router.navigate(['/tabs/tab1']);
        }
      } catch (erro: any) {
        loading.dismiss();

        if (erro.code === 'auth/wrong-password') {
          this.loginForm.get('password')?.setErrors({ wrongPassword: true });
        } else if (erro.code === 'auth/user-not-found') {
          this.loginForm.get('email')?.setErrors({ userNotFound: true });
        } else if (erro.code === 'auth/invalid-email') {
          this.loginForm.get('email')?.setErrors({ invalidEmail: true });
        } else if (erro.code === 'auth/invalid-credential') {
          // Trata erro genérico quando Firebase não detalha o erro
          this.loginForm.setErrors({ invalidLogin: true });
        }

      }
    } else {
      this.loginForm.markAllAsTouched();
      loading.dismiss();
    }
  }

  // Getter não utilizado no código atual — talvez tenha sido pensado para futuro uso com nome completo
  get fullname() {
    return this.loginForm.get('fullname');
  }
}
