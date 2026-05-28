import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { ApplicationsService } from '../../services/applications.service';

@Component({
  selector: 'app-create-application',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, SelectModule, DatePickerModule, RouterLink],
  templateUrl: './create-application.component.html',
})
export class CreateApplicationComponent {
  form: FormGroup;
  loading = false;

  roomOptions = [
    { label: 'Аудитория', value: 'auditorium' },
    { label: 'Коворкинг', value: 'coworking' },
    { label: 'Кинозал', value: 'cinema' },
  ];

  paymentOptions = [
    { label: 'Наличными', value: 'cash' },
    { label: 'Перевод по номеру телефона', value: 'transfer' },
  ];

  constructor(
    private fb: FormBuilder,
    private appsSvc: ApplicationsService,
    private router: Router,
    private msg: MessageService,
  ) {
    this.form = this.fb.group({
      room_type:       [null, Validators.required],
      conference_date: [null, Validators.required],
      payment_method:  [null, Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const val = this.form.value;
    const date: Date = val.conference_date;
    const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

    this.appsSvc.create({ ...val, conference_date: dateStr }).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Заявка отправлена на согласование' });
        setTimeout(() => this.router.navigate(['/applications']), 1000);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Ошибка при создании заявки' });
        this.loading = false;
      },
    });
  }
}
