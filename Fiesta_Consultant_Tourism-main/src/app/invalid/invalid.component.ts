import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router'; // ✅ Correct import

@Component({
  selector: 'app-invalid',
  imports: [RouterOutlet],
  templateUrl: './invalid.component.html',
  styleUrl: './invalid.component.css'
})
export class InvalidComponent {
  constructor(private router: Router) {}

  VisitHome():void{
    this.router.navigateByUrl('/main');
  }
}
