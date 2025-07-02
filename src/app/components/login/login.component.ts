import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  userFormGroup = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.userFormGroup.valid) {
      const { email, password } = this.userFormGroup.value;
      this.authenticationService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['']);
        }
      });
    } else
        this.userFormGroup.markAllAsTouched();
  }
}

