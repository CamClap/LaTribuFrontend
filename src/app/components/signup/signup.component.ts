import {Component, inject} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule} from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  imports: [ButtonModule, InputTextModule, PasswordModule, FileUploadModule, TextareaModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  userFormGroup = User.formGroup();
  photo?: File;

  userService = inject(UserService);
  router = inject(Router);

  onSubmit(): void {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      return;
    }
    const user = this.userFormGroup.value;
    this.userService.save(user).subscribe({
      next: (res) => {
        this.router.navigateByUrl("/login");
      },
      error: (err) => {
        console.error('Erreur lors de la création', err);
      }
    });
  }  onCancel() {
    this.router.navigateByUrl("/");
  }

  onPhoto(files: FileList | null) {
    if (files) {
      this.photo = files[0]
    }
  }
}
