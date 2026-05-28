import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      login:     ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      password:  ['', [Validators.required, Validators.minLength(8)]],
      full_name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁа-яё\s]+$/)]],
      phone:     ['', [Validators.required, Validators.pattern(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/)]],
      email:     ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/applications']),
      error: (err) => {
        this.error = err.error?.message || 'Ошибка регистрации';
        this.loading = false;
      },
    });
  }
}
