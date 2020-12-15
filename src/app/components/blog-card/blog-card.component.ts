import { Component, OnInit } from "@angular/core";
import { BlogService } from "src/app/services/blog.service";
import { NgModule } from "@angular/core";
import { Post } from "src/app/models/post";
import { ActivatedRoute } from "@angular/router";
import { AppUser } from "src/app/models/appuser";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { BlogEditorComponent } from "../blog-editor/blog-editor.component";
import { CommentService } from "../../services/comment.service";

@NgModule({
  providers: [BlogEditorComponent],
  declarations: [BlogEditorComponent],
})
@Component({
  selector: "app-blog-card",
  templateUrl: "./blog-card.component.html",
  styleUrls: ["./blog-card.component.scss"],
})
export class BlogCardComponent implements OnInit {
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  postData = new Post();
  postId: string;

  config: any;
  pageSizeOptions = [];
  blogPost: Post[] = [];
  appUser: AppUser;

  constructor(
    private blogService: BlogService,
    private commentService: CommentService,
    private _route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));

    this.pageSizeOptions = [6, 12, 50];
    const pageSize = localStorage.getItem("pageSize");
    this.config = {
      currentPage: 1,
      itemsPerPage: pageSize ? +pageSize : this.pageSizeOptions[0],
    };
    {
      if (this._route.snapshot.params["id"]) {
        this.postId = this._route.snapshot.paramMap.get("id");
      }
    }
  }

  ngOnInit() {
    this.blogService.getPostbyId(this.postId).subscribe((result: Post) => {
      this.fb = result ? result.imgPost : null;
      this.postData = result;
    });
    this._route.params.subscribe((params) => {
      this.config.currentPage = +params["pagenum"];
      this.getBlogPosts();
    });
  }

  getBlogPosts() {
    this.blogService.getAllPosts().subscribe((result) => {
      this.blogPost = result;
    });
  }

  delete(postId) {
    if (confirm("Tényleg törlöd a cikket?")) {
      this.blogService.deletePost(postId).then(() => {
        alert("Sikeres törlés");
      });
      this.commentService.deleteAllCommentForBlog(postId);
    }
  }
}
