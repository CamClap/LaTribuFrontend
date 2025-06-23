import { FormControl, FormGroup, Validators } from "@angular/forms";
import {Group} from './group.model';
import { passwordValidator } from '../shared/validators/password.validator';

export interface User {
  id: number;
  email: string;
  name: string;
  nickname?: string;
  roles: string[];
  password?: string;
  family: Group[];
}

export namespace User {
  export function formGroup(user?: User) {
    return new FormGroup({
      name: new FormControl(user?.name ?? '', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      nickname: new FormControl(user?.nickname ?? '', { nonNullable: true, validators: [Validators.minLength(3)] }),
      email: new FormControl(user?.email ?? '', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl(user?.password ?? '', { nonNullable: true, validators: [Validators.required, passwordValidator] }),
    })
  }
}
