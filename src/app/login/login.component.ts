import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { Usuario } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {


  constructor(private loginService: LoginService, private router: Router, private userService: UsuarioService) { }

  

  ngOnInit() {
    
  }
}
