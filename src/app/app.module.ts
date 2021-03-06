import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import {
  AngularFirestoreModule,
  AngularFirestore,
} from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgMaterialModule } from "./ng-material/ng-material.module";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgxPaginationModule } from "ngx-pagination";
import { HttpClientModule } from "@angular/common/http";
import { AngularWeatherWidgetModule } from 'angular2-weather-widget';

import { AppComponent } from "./app.component";
import { environment } from "src/environments/environment";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { HomeComponent } from "./components/home/home.component";
import { BlogEditorComponent } from "./components/blog-editor/blog-editor.component";
import { BlogCardComponent } from "./components/blog-card/blog-card.component";
import { ExcerptPipe } from "./custompipes/excerpt.pipe";
import { SlugPipe } from "./custompipes/slug.pipe";
import { BlogComponent } from "./components/blog/blog.component";
import { PaginatorComponent } from "./components/paginator/paginator.component";
import { AuthGuard } from "./guards/auth.guard";
import { AngularFireStorage } from "@angular/fire/storage";
import { CommentsComponent } from './components/comments/comments.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    BlogEditorComponent,
    BlogCardComponent,
    ExcerptPipe,
    SlugPipe,
    BlogComponent,
    PaginatorComponent,
    CommentsComponent
  ],
  imports: [
    NgxPaginationModule,
    AngularWeatherWidgetModule,
    AngularFireAuthModule,
    BrowserModule,
    CKEditorModule,
    HttpClientModule,
    FormsModule,
    NgMaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "page/:pagenum", component: HomeComponent },
      {
        path: "addpost",
        component: BlogEditorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "editpost/:id",
        component: BlogEditorComponent,
        canActivate: [AuthGuard],
      },
      { path: "blog/:id/:slug", component: BlogComponent },
      { path: "**", component: HomeComponent },
    ]),
    AppRoutingModule,
  ],
  providers: [AngularFirestore, AngularFireStorage],
  bootstrap: [AppComponent],
})
export class AppModule {}
