import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export default class LogoutComponent {
  constructor(private router: Router,
    private service: AuthService,
    private _ngZone: NgZone) { }

    public logout(){
      //this.service.signOutExternal();
      this._ngZone.run(() => {
        this.service.revokeToken().subscribe({
          next: (x:any) => {
            this.router.navigate(['/']).then(() => window.location.reload());
          }
        })
      })
    }

}
