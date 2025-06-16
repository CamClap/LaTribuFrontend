import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Person } from "./person.model";

export interface User extends Person {
  id: number;
  name: string;
  nickname: string;
  picture: string;
  birthdate: Date;
}

export namespace User {
  export function formGroup(user?: User) {
    return new FormGroup({
      name: new FormControl(user?.name ?? '', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      nickname: new FormControl(user?.nickname ?? '', { nonNullable: true, validators: [Validators.minLength(3)] }),
      // picture: new FormControl(user?.picture ?? '', { nonNullable: true, validators: [Validators.minLength(3)] }),
      email: new FormControl(user?.email ?? '', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl(user?.password ?? '', { nonNullable: true, validators: [Validators.required] }),
    })
  }
}