import { Component, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
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

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onSubmit() {
    console.log("userFormGroup", this.userFormGroup.getRawValue());
    if (this.userFormGroup.valid)
      this.userService.save(this.userFormGroup.value, this.photo!).subscribe({
        next: () => this.router.navigateByUrl("/login")
      });
    else
      console.log("form invalid"),
        this.userFormGroup.markAllAsTouched();
  }

  onCancel() {
    this.router.navigateByUrl("/");
  }

  onPhoto(files: FileList | null) {
    if (files) {
      this.photo = files[0]
    }
  }
}
