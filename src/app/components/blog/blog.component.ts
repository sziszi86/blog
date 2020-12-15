import { Component, OnInit } from "@angular/core";
import { NgModule } from "@angular/core";
import { Post } from "src/app/models/post";
import { ActivatedRoute } from "@angular/router";
import { BlogService } from "src/app/services/blog.service";
import { BlogEditorComponent } from "../blog-editor/blog-editor.component";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
@NgModule({
  providers: [BlogEditorComponent],
  declarations: [BlogEditorComponent],
})
@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  postData = new Post();
  postId: string;
  content: any;

  constructor(
    private sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private blogService: BlogService
  ) {
    if (this._route.snapshot.params["id"]) {
      this.postId = this._route.snapshot.paramMap.get("id");
    }
  }

  ngOnInit() {
    this.blogService.getPostbyId(this.postId).subscribe((result: Post) => {
      this.fb = result.imgPost;
      this.postData = result;
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        this.postData.content
      );
    });
  }
}
