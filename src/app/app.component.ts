import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    //this.checkIfUserIsLoggedIn();
  }
/*
  checkIfUserIsLoggedIn() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        // Usuário logado, redireciona para a home (tabs)
        this.router.navigate(['/tabs/tab1']);
      } else {
        // Usuário não está logado
        this.router.navigate(['/home']);
      }
    });
  }*/
}
