import { Component, OnInit } from '@angular/core';
import { AuthenticationService, ConnectedUser } from '../../services/authentication.service';
import { GroupService } from '../../services/group.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

import { Post } from '../../models/post.model';
import { Group } from '../../models/group.model';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  standalone: true,
  imports: [CKEditorModule, FormsModule, ReactiveFormsModule]
})
export class PostComponent implements OnInit{
  public Editor: any = ClassicEditor;
  public editorData: string = '';
  public postTitle: string = '';

  selectedFile: File | null = null;
  currentUser: ConnectedUser | null | undefined = undefined;
  selectedGroup: Group | null = null;

  form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private groupService: GroupService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentPersonSync();

    if (!this.currentUser) {
      return;
    }

    this.groupService.getGroupsByUser(this.currentUser.id).subscribe({
      next: (groups) => {
        if (groups && groups.length > 0) {
          this.selectedGroup = groups[0];
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des groupes :", err);
      }
    });
  }

  onReady(editor: any) {
    console.log("CKEditor is ready!");
  }

  createPost() {
    if (!this.currentUser) {
      alert("Vous devez être connecté");
      return;
    }
    if (this.form.invalid) {
      alert("Le formulaire est incomplet");
      return;
    }
    const today = new Date();

    if (!this.selectedGroup) {
      alert("Aucun groupe sélectionné !");
      return;
    }

    const newPost: Post = {

      title: this.postTitle || 'Titre par défaut',
      content: this.editorData,
      format: "text",
      creator: `/api/users/${this.currentUser.id}`,
      groupOfPost: `/api/groups/${this.selectedGroup?.id}`,
      date: today
    };


    this.postService.save(newPost).subscribe({
      next: () => {
        alert("Post créé !");
        this.editorData = '';
        this.postTitle = '';
        this.selectedFile = null;
        this.form.reset();
        this.router.navigate(['/']);
      },
      error: err => {
        console.error(err);
        alert("Erreur lors de la création du post");
      }
    });
  }
}
