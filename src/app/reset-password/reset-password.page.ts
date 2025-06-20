import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; // Importação do Ionic para mostrar loaders (carregamento visual)
import { AuthenticationService } from 'src/app/services/authentication.service'; // Importa o serviço de autenticação personalizado
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {

  resetForm!: FormGroup;

  constructor(
    public authService: AuthenticationService, // Serviço responsável pela lógica de resetar a senha
    public router: Router, // Serviço do Angular para navegação entre páginas
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
     this.resetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]]
    });
  }

  get errorControl() {
    return this.resetForm.controls;
  }

  // Método assíncrono chamado quando o usuário solicita o reset de senha
  async resetPassword() {
    // Cria e exibe o loading
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading'
    });
    await loading.present();

    
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;

      this.authService.resetPassword(email)
        .then(async () => {
          await loading.dismiss();

          this.router.navigate(['/login']);
        })
        .catch(async (erro) => {
          await loading.dismiss();

          if (erro.code === 'auth/user-not-found') {
            this.resetForm.get('email')?.setErrors({ emailNaoEncontrado: true });
          }

          console.error(erro);
        });

    } else {
      this.resetForm.markAllAsTouched();
      loading.dismiss();
    }
  }
}
