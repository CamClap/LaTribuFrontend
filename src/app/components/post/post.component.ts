import { Component } from '@angular/core';
import { AuthenticationService, ConnectedUser } from '../../services/authentication.service';
import { GroupService } from '../../services/group.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

import { Post } from '../../models/post.model';
import { Role } from '../../models/person.model';
import { Group } from '../../models/group.model';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  standalone: true,
  imports: [CKEditorModule, FormsModule]
})
export class PostComponent {
  public Editor = ClassicEditor as any;
  public editorData: string = '';
  public postTitle: string = '';


  selectedFile: File | null = null;
  currentUser: ConnectedUser | null | undefined = undefined;
  selectedGroup: Group | null = null;

  constructor(
    private authService: AuthenticationService,
    private groupService: GroupService,
    private userService: UserService,
    private postService: PostService,
    private router: Router
  ) { }

  onReady(editor: any) {
    console.log("CKEditor is ready!");
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  createPost() {
    const user = this.authService.getCurrentPersonSync();
    if (!user) {
      alert("Vous devez être connecté");
      return;
    }
    const currentGroup = this.groupService.getCurrentGroupSync() ?? undefined;

    const creator = {
      id: user.id,
      name: user.name,
      nickname: '',
      picture: '',
      birthdate: new Date(0),
      email: '',
      roles: ['ROLE_USER'],     // au minimum un tableau vide ou les rôles de l’utilisateur
      family: [],               // tableau vide si tu n’as pas les données à ce moment-là
      password: undefined
    };

    const newPost: Post = {
      title: this.postTitle || 'Titre par défaut',
      content: this.editorData,
      format: 'text',
      creator,
      group: currentGroup

    };

    this.postService.save(newPost).subscribe({
      next: () => {
        alert("Post créé !");
        this.editorData = '';
        this.postTitle = '';
        this.selectedFile = null;
        this.router.navigate(['/']);
      },
      error: err => {
        console.error(err);
        alert("Erreur lors de la création du post");
      }
    });
  }
}
