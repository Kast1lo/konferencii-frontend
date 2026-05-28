import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  providers: [MessageService],
  template: `<p-toast position="bottom-right" /><router-outlet />`,
})
export class App {}
