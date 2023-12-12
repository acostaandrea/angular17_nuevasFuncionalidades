import { Component, NgZone } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  form = this.fb.group({
    username: ['', Validators.email],
    password: ['', Validators.required]
  });

  private clientId = environment.clientId

  constructor(
    private router: Router,
    private service: AuthService,
    private _ngZone: NgZone,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar) { }

    ngOnInit(): void {

      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true
        });
        // @ts-ignore
        google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("buttonDiv"),
          { theme: "outline", size: "large", width: "100%" }
        );
        // @ts-ignore
        google.accounts.id.prompt((notification: PromptMomentNotification) => {});
      };
    }

    async handleCredentialResponse(response: CredentialResponse) {
      await this.service.LoginWithGoogle(response.credential).subscribe(
        (x:any) => {
          localStorage.setItem('token', x.token);
          this._ngZone.run(() => {
            this.router.navigate(['/logout']);
          })},
        (error:any) => {
            console.log(error);
          }
        );
  }

  async onSubmit() {
    //this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        this.service.login(this.form.value).subscribe((x: any) => {
          this.router.navigate(['/logout']);
          this._snackBar.open("Login Successful", "Close", {
            duration: 2000
          });
        },
          (error: any) => {
            console.error(error);
            this._snackBar.open("Error with Username or Password", "Close", {
              duration: 5000
            });
          });
      } catch (err) {
        this._snackBar.open("Error with Username or Password", "Close", {
          duration: 5000
        });
      }
    } else {
      //this.formSubmitAttempt = true;
    }
  }


  // async login() {
  //   FB.login(async (result:any) => {
  //       await this.service.LoginWithFacebook(result.authResponse.accessToken).subscribe(
  //         (x:any) => {
  //           this._ngZone.run(() => {
  //             this.router.navigate(['/logout']);
  //           })},
  //         (error:any) => {
  //             console.log(error);
  //           }
  //         );
  //   }, { scope: 'email' });

  // }

}
