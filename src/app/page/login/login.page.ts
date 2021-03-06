import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { User } from 'src/app/modals/User';

@Component({
  selector: 'app-home',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  constructor(
    public service: LoginService,
    public toastController: ToastController,
    private router: Router
  ) {}

  username: string;
  password: string;
  Users = [];
  user: User;

  async login() {
    let userList = this.service.findUser();

    userList.snapshotChanges().subscribe((res) => {
      this.Users = [];

      res.forEach((item) => {
        let payload = item.payload.toJSON();

        if (payload['username'] === this.username) {
          payload['$key'] = item.key;
          console.log(payload);
          this.Users.push(payload);
        }
      });

      if (this.Users.length == 0) {
        this.presentToast('Usuario não cadastrado!');
      }

      this.user = this.Users[0];

      if (!this.username || !this.password) {
        this.presentToast('Por favor digitar usuario ou senha!');
      } else {
        if (this.user.password === this.password) {
          this.router.navigate(['/registrion-data/', this.user.$key]);
        } else {
          this.presentToast('Senha incorreta!');
        }
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: 'danger',
    });
    toast.present();
  }
}
