import { Component, AfterViewInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ScrollPanel } from 'primeng/primeng';
import { LoginService } from './login/login.service';
import { Usuario } from './login/login';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    animations: [
        trigger('submenu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
    private UsuarioMaster: String = "admin";

    addForm: FormGroup;
    private user : Usuario = new Usuario();
    public logeado : boolean;

    public menuInactiveDesktop: boolean;

    public menuActiveMobile: boolean;

    public profileActive: boolean;

    public topMenuActive: boolean;

    public topMenuLeaving: boolean;
    moveBar;
    @ViewChild('scroller', { static: true }) public scrollerViewChild: ScrollPanel;

    documentClickListener: () => void;

    menuClick: boolean;

    topMenuButtonClick: boolean;
    isError: boolean;

    constructor(public renderer: Renderer2, private loginService: LoginService, private router: Router, private formBuilder: FormBuilder) {
        this.addForm = this.formBuilder.group({
            usu_id: [],
            usu_usuario: ['', Validators.required],
            usu_password: ['', Validators.required]

        });
    }

    ngAfterViewInit() {
        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
            if (!this.isDesktop()) {
                if (!this.menuClick) {
                    this.menuActiveMobile = false;
                }

                if (!this.topMenuButtonClick) {
                    this.hideTopMenu();
                }
            }

            this.menuClick = false;
            this.topMenuButtonClick = false;
        });
    }

    logIn() {
        if (this.addForm.invalid) {
            Swal.fire(
                'Inicio de sesión fallida', 'Existen campos vacios','error'
            )  
            return this.logeado = false;
        }else{
            this.loginService.buscarporNombre(this.addForm.value.usu_usuario).subscribe
            (data => {
                this.user=data;
                try{
                    if (data.usuaContraseña == this.addForm.value.usu_password) {
                        this.router.navigate(['Inicio']);
                        return this.logeado = true;
                    }else{
                        Swal.fire(
                            'Inicio de sesión fallida', 'La contraseña del usuario es erronea','error'
                        ) 
                    }
                }catch(e){
                    Swal.fire(
                        'Inicio de sesión fallida', 'El usuario no esta registrado en el sistema','error'
                    )
                    return this.logeado = false; 
                }
            },);
        }
    }
    
    toggleMenu(event: Event) {
        this.menuClick = true;
        if (this.isDesktop()) {
            this.menuInactiveDesktop = !this.menuInactiveDesktop;
            if (this.menuInactiveDesktop) {
                this.menuActiveMobile = false;
            }
        } else {
            this.menuActiveMobile = !this.menuActiveMobile;
            if (this.menuActiveMobile) {
                this.menuInactiveDesktop = false;
            }
        }

        if (this.topMenuActive) {
            this.hideTopMenu();
        }

        event.preventDefault();
    }

    toggleProfile(event: Event) {
        this.profileActive = !this.profileActive;
        event.preventDefault();
    }

    toggleTopMenu(event: Event) {
        this.topMenuButtonClick = true;
        this.menuActiveMobile = false;

        if (this.topMenuActive) {
            this.hideTopMenu();
        } else {
            this.topMenuActive = true;
        }

        event.preventDefault();
    }

    hideTopMenu() {
        this.topMenuLeaving = true;
        setTimeout(() => {
            this.topMenuActive = false;
            this.topMenuLeaving = false;
        }, 500);
    }

    onMenuClick() {
        this.menuClick = true;

        //  setTimeout(() => {this.scrollerViewChild.moveBar(); }, 500);
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    onSearchClick() {
        this.topMenuButtonClick = true;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }

    cerrarSesion(){
        this.logeado=false;
    }
}