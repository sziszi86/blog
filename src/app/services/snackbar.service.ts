import {
  Injectable
} from '@angular/core';
import {
  MatSnackBarModule
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBarModule) {}
}
