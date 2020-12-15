import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Post } from 'src/app/models/post';
import { DatePipe } from '@angular/common';
import { BlogService } from 'src/app/services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AppUser } from '../../models/appuser';

export class UploadAdapter {
  private loader;
  constructor( loader ) {
     this.loader = loader;
  }

  upload() {
     return this.loader.file
           .then( file => new Promise( ( resolve, reject ) => {
                 var myReader= new FileReader();
                 myReader.onloadend = (e) => {
                    resolve({ default: myReader.result });
                 }

                 myReader.readAsDataURL(file);
           } ) );
  };
}
@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
  providers: [DatePipe],
})
export class BlogEditorComponent implements OnInit {
  title = 'cloudsSorage';
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  public Editor = ClassicEditor;
  ckeConfig: any;
  postData = new Post();
  formTitle = 'Létrehozom a';
  postId = '';
  appUser: AppUser;
  author: string;
  filebrowserUploadUrl  =  'base64';

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private _route: ActivatedRoute,
    private datePipe: DatePipe,
    private blogService: BlogService,
    private _router: Router
  ) {
    if (this._route.snapshot.params['id']) {
      this.postId = this._route.snapshot.paramMap.get('id');
    }
  }

  ngOnInit() {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);

    this.setEditorConfig();
    if (this.postId) {
      this.formTitle = 'Szerkesztem a';
      this.blogService.getPostbyId(this.postId).subscribe((result: Post) => {
        if (result) {
          this.setPostFormData(result);
        }
      });
    }
    this.blogService.getPostbyId(this.postId).subscribe((result: Post) => {
      this.fb = result.imgPost;
      this.postData = result;
    });
  }

  setPostFormData(postFormData) {
    this.postData.title = postFormData.title;
    this.postData.content = postFormData.content;
  }

  setEditorConfig() {
    this.ckeConfig = {
      mediaEmbed: {
        previewsInData: true
    },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6',
          },
          { model: 'Formatted', view: 'pre', title: 'Formatted' },
        ],
      },
    };
  }

  saveBlogPost() {
    if (this.postId) {
      this.blogService.updatePost(this.postId, this.postData).then(() => {
        this._router.navigate(['/']);
      });
    } else {
      this.postData.createdDate = this.datePipe.transform(
        Date.now(),
        'yyyy-MM-dd HH:mm'
      );
      this.postData.author = this.appUser.name;
      this.blogService.createPost(this.postData).then(() => {
        this._router.navigate(['/']);
      });
    }
  }

  cancel() {
    this._router.navigate(['/']);
  }

  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `postimage/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`postimage/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
            if (url) {
              this.postData.imgPost = url;
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });
  }
  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log('loader : ', loader)
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }
}
