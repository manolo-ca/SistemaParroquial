import {Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="menu">
            <ul app-submenu [item]="model" root="true" parentActive="true"></ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[];
    ngOnInit() {
        this.model = [
            {label: 'Inicio', icon: 'pi pi-home', routerLink: ['Inicio']},
            {
                label: 'Servicios Pastorales', icon: 'pi pi-users',
                items: [
                    {label: 'Registrarse',icon: 'pi pi-user-plus', routerLink:'resgistro-personas'},
                    {label: 'Administrar',icon: 'pi pi-lock',
                    items: [
                        
                        {label: 'Administrar Servicios Pastorales',icon: 'pi pi-unlock', routerLink:'serviciospastorales/administrar/servicios-lista'},
                        {label: 'Administrar Tipo de Documentos', icon: 'pi pi-unlock',routerLink:'serviciospastorales/administrar/documentos-tipos'},
                        {label: 'Administrar Tipo de Eucaristias', icon: 'pi pi-unlock',routerLink:'serviciospastorales/administrar/eucaristia-tipos'},
                        {label: 'Administrar Documentos de Personas', icon: 'pi pi-unlock',routerLink:'serviciospastorales/administrar/documentos-persona'},
                        {label: 'Administrar Emisión de Documentos', icon: 'pi pi-unlock',routerLink:'serviciospastorales/administrar/documentos-emision'},
                        {label: 'Administrar Inscripción a Eucaristias', icon: 'pi pi-unlock',routerLink:'serviciospastorales/administrar/eucaristia-inscripcion'},
                        {label: 'Administrar Reservación a Eucaristias', icon: 'pi pi-unlock',routerLink:'serviciospastorales/administrar/eucaristia-reservacion'}
                    ]
                    },
                    {label: 'Servicios', icon: 'pi pi-ticket',routerLink:'',
                    items: [
                        
                        {label: 'Emisión de Documentos',icon: 'pi pi-user', routerLink:'serviciospastorales/usuario/documentos-emision-usuario'},
                        {label: 'Inscripción a Eucaristias', icon: 'pi pi-user',routerLink:'serviciospastorales/usuario/eucaristia-inscripcion-usuario'},
                        {label: 'Reservación a Eucaristias', icon: 'pi pi-user',routerLink:'serviciospastorales/usuario/eucaristia-reservacionusuario'}
                    ]
                },
                ]
            },
            
            {
                label: 'Matrículas Catequesís', icon: 'pi pi-id-card',
                items: [
                    {label: 'Administración', icon: 'pi pi-lock',routerLink:'',
                    items: [
                    
                    {label: 'Admininstrar Matrículas', icon: 'pi pi-unlock', routerLink:'matriculas/administrar/matriculados'},
                    {label: 'Admininstrar Cursillos', icon: 'pi pi-unlock',
                        items: [
                            {label: 'Pre-Bautismal', icon: 'pi pi-unlock', routerLink:'matriculas/administrar/cbautizo'},
                            {label: 'Pre-Matrimonial', icon: 'pi pi-unlock', routerLink:'matriculas/administrar/cmatrimonio'}
                    ]},
                    
                    {label: 'Admininstrar Alumnos', icon: 'pi pi-unlock', routerLink:'alumnos'},
                    {label: 'Admininstrar Tipos de Inscripción', icon: 'pi pi-unlock', routerLink:'administrarTipoInscripcion'},
                    {label: 'Admininstrar Niveles', icon: 'pi pi-unlock', routerLink:'niveles'},
                    {label: 'Admininstrar Periodos', icon: 'pi pi-unlock', routerLink:'periodos'},
                    {label: 'Gestión Representantes', icon: 'pi pi-unlock', routerLink:'matriculas/administrar/representante'}

                ]
            },
                {label: 'Servicios', icon: 'pi pi-ticket',routerLink:'',
                items: [
                    {label: 'Matricula Catequesís', icon: 'pi pi-users', routerLink:'matriculaCatequesis'},//añadir nuestras paginas
                    {label: 'Inscripción Cursillo Pre-Bautismal', icon: 'pi pi-users', routerLink:'cursillobautizo'},
                    {label: 'Inscripción Cursillo Pre-Matrimonial', icon: 'pi pi-users', routerLink:'cursillomatrimonio'},
                    
                ]}]
            },
            {
                label: 'Calendario', icon: 'pi pi-calendar', 
                items: [
                    {label: 'Calendario Usuario', icon: 'pi pi-calendar', routerLink:'calendarioCliente'},//añadir nuestras paginas
                    {label: 'Calendario Administrador', icon: 'pi pi-lock', routerLink:'calendarioAdmministrador'}
                ]
            },
            {
                label: 'Ventas', icon: 'pi pi-print',
                items: [
                    {label: 'Caja', icon: 'pi pi-dollar',routerLink:'',
                    items: [
                        {label: 'Abrir Caja',icon: 'pi pi-user', routerLink:'facturacion/caja-apertura'},
                        {label: 'Cerrar Caja', icon: 'pi pi-user',routerLink:'facturacion/caja-cerra'}
                    ]},
                    {label: 'Generar Factura',icon: 'pi pi-file', routerLink:'sistemaparroquial/ventas/facturar'},
                    {label: 'Generar Recibo', icon: 'pi pi-file', routerLink: 'sistemaparroquial/ventas/recibo'},
                    {label: 'Gestionar Facturas', icon: 'pi pi-lock', routerLink: 'sistemaparroquial/ventas/administrar/facturas'},
                    {label: 'Gestionar Recibos', icon: 'pi pi-lock', routerLink: 'sistemaparroquial/ventas/administrar/recibos'},

                ]
            },
            {
                label: 'Compras', icon: 'pi pi-money-bill',
                items: [
                    {label: 'Ingresar compra',icon: 'pi pi-shopping-cart', routerLink:'sistemaparroquial/compras/ingreso'},
                    {label: 'Gestionar Compras', icon: 'pi pi-lock', routerLink: 'sistemaparroquial/compras/administrar'},
                ]
            },
            {label: 'Reportes', icon: 'pi pi-chart-bar', routerLink: ['facturacion/reportes']},
            {
                label: 'Bodega', icon: 'pi pi-briefcase', badgeStyleClass: 'green-badge',
                items: [
                    {label: 'Gestión de Capillas', icon: 'pi pi-home', routerLink: 'bodega/capillas'},
                    {label: 'Gestión de Almacenes', icon: 'pi pi-sitemap', routerLink: 'bodega/almacenes'},
                    {label: 'Gestión de Productos', icon: 'pi pi-tag', routerLink:'bodega/productos'},
                    {label: 'Gestión de Inventario', icon: 'pi pi-tags', routerLink: 'bodega/inventario'},
                    {label: 'Gestión de Activos', icon: 'pi pi-chart-line', routerLink: 'bodega/activos'},
                    {label: 'Gestión de Proveedores', icon: 'pi pi-users', routerLink: 'bodega/proveedores'},
                    {label: 'Reportes', icon: 'pi pi-print', routerLink: 'bodega/reportescapillas'}
                ]
            },
            {label: 'Soporte', icon: 'pi pi-info', routerLink: '#'}
        ];
    }
}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ul>
            <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
                <li [ngClass]="{'active-menuitem': isActive(i), 'ui-state-disabled':child.disabled}" [class]="child.badgeStyleClass">
                    <a *ngIf="!child.routerLink" [href]="child.url||'#'" (click)="itemClick($event,child,i)"
                       [attr.tabindex]="!visible ? '-1' : null"  [attr.target]="child.target">
                        <i [ngClass]="child.icon"></i>
                        <span>{{child.label}}</span>
                        <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                        <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    </a>
                    <a *ngIf="child.routerLink" (click)="itemClick($event,child,i)" [attr.target]="child.target"
                        [routerLink]="!child.disabled?child.routerLink:null" routerLinkActive="active-menuitem-routerlink"
                       [routerLinkActiveOptions]="{exact: true}">
                        <i [ngClass]="child.icon"></i>
                        <span>{{child.label}}</span>
                        <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                        <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    </a>
                    <ul app-submenu [item]="child" *ngIf="child.items"
                        [@children]="isActive(i) ? 'visible' : 'hidden'"  [parentActive]="isActive(i)"></ul>
                </li>
            </ng-template>
        </ul>
    `,
    animations: [
        trigger('children', [
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
export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    activeIndex: number;

    _parentActive: boolean;

    constructor(public app: AppComponent) {}

    itemClick(event: Event, item: MenuItem, index: number) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            item.command({originalEvent: event, item});
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            //setTimeout(() => {this.app.scrollerViewChild.moveBar(); }, 400);
            event.preventDefault();
        }

        if (!item.items) {
            this.app.menuActiveMobile = false;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }

    set parentActive(val: boolean) {
        this._parentActive = val;

        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }
}
