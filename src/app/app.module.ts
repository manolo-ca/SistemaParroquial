import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { PanelModule } from 'primeng/panel';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import {AppMenuComponent, AppSubMenuComponent} from './app.menu.component';

import {CarService} from './demo/service/carservice';
import {CountryService} from './demo/service/countryservice';
import {EventService} from './demo/service/eventservice';
import {NodeService} from './demo/service/nodeservice';

import { MatCheckboxModule } from '@angular/material';
import {ModuloComponent} from './Inicio/modulo/modulo.component';
import { LoginService } from './login/login.service';
import { LoginComponent} from './login/login.component';

import { TiposdocumentosComponent } from './modulosp/administrar/tiposdocumentos/tiposdocumentos.component';
import { EmiciondocumentosComponent } from './modulosp/administrar/emiciondocumentos/emiciondocumentos.component';
import { EmisiondocumentosusuarioComponent } from './modulosp/usuario/emisiondocumentosusuario/emisiondocumentosusuario.component';
import { ReservacioneucaristiasusuarioComponent } from './modulosp/usuario/reservacioneucaristiasusuario/reservacioneucaristiasusuario.component';
import { DocumentopersonasComponent } from './modulosp/administrar/documentopersonas/documentopersonas.component';
import { ReservacioneucaristiasComponent } from './modulosp/administrar/reservacioneucaristias/reservacioneucaristias.component';
import { InscripcioneucaristiasComponent } from './modulosp/administrar/inscripcioneucaristias/inscripcioneucaristias.component';
import { DocumentopersonascrearComponent } from './modulosp/administrar/documentopersonascrear/documentopersonascrear.component';
import { TipoeucaristiasComponent } from './modulosp/administrar/tipoeucaristias/tipoeucaristias.component';
import { InscripcioneucaristiasusuarioComponent } from './modulosp/usuario/inscripcioneucaristiasusuario/inscripcioneucaristiasusuario.component';
import { RegistropersonaComponent } from './modulosp/registropersona/registropersona.component';
import { ServicioslistaComponent } from './modulosp/administrar/servicioslista/servicioslista.component';

import { InventarioComponent} from './modulobodega/inventarios/inventario.component';
import { ActivosComponent } from './modulobodega/activos/activos.component';
import { ProveedorComponent } from './modulobodega/proveedores/proveedor.component';
import { CapillaComponent } from './modulobodega/capillas/capilla.component';
import { AlmacenComponent } from './modulobodega/almacen/almacen.component';
import { ProductoComponent } from './modulobodega/productos/producto.component';


import { FormfacturaComponent } from './modulofactura/factura/formulariofactura/formfactura.component';
import { FormcompraComponent } from './modulofactura/compra/compraformulario/formcompra.component';
import { CajaComponent } from './modulofactura/caja/cajagestion/caja.component';
import { FormaperturarcajaComponent } from './modulofactura/caja/aperturacaja/formaperturarcaja.component';
import { FormcerrarcajaComponent } from './modulofactura/caja/cerrarcaja/formcerrarcaja.component';
import { ReportesComponent } from './modulofactura/reportes/reportes.component';
import { ReciboComponent } from './modulofactura/recibo/recibo.component';
import { TipodocumentoService } from './modulosp/administrar/tiposdocumentos/tipodocumento.service';
import { TipoEucaristiaService } from './modulosp/administrar/tipoeucaristias/tipoeucaristia.service';
import { GenericService } from './spring-generic-mvc/service/generic.service';
import { SpringGenericMVCModule } from './spring-generic-mvc/SpringGenericMVCModule';
import { InscripcioneucaristiaService } from './modulosp/administrar/inscripcioneucaristias/inscripcioneucaristias.service';
import { ReservacionEucaristiaService } from './modulosp/administrar/reservacioneucaristias/reservacioneucaristia.service';

import { CalendarioService } from './modulosp/usuario/calendario.service';
import { AdministrarTipoInscripcionComponent } from './modulomatriculas/administrar-tipo-inscripcion/administrar-tipo-inscripcion.component';
import { AdministrarPeriodoComponent } from './modulomatriculas/administrar-Periodos/Periodo.component';
import { AulasComponent } from './modulomatriculas/administrar-aulas/Aulas.component';
import { AdministrarNivelComponent } from './modulomatriculas/administrar-Niveles/Niveles.component';
import { MatriculaalumnoRegistradoComponent } from './modulomatriculas/matriculaalumno-registrado/matriculaalumno-registrado.component';
import { DirigentesComponent } from './modulomatriculas/administrarDirigentes/Dirigentes.component';
import { ConfirmarMatriculasComponent } from './modulomatriculas/confirmar-matriculas/confirmar-matriculas.component';
import { AdministraralumnosComponent } from './modulomatriculas/AdministrarAulmno/AdministrarAlumno.component';
import { AdministrarrepresentantesComponent } from './modulomatriculas/administrarrepresentantes/administrarrepresentantes.component';
import { AdministrarpadrinosComponent } from './modulomatriculas/administrarpadrinos/administrarpadrinos.component';
import { UsuarioAlumnosComponent } from './modulomatriculas/UsuarioAlumno/UsuarioAlumno.component';
import { AdministrarcbautizoComponent } from './modulomatriculas/administrarCBautizo/administrarcbautizo.component';
import { AdministrarcmatrimonioComponent } from './modulomatriculas/administrarCMatrimonio/administrarcmatrimonio.component';
import { cursilloBautizoComponent } from './modulomatriculas/InscripcionCBautizo/cursilloBautizo.component';
import { cursilloMatrimoniocomponent } from './modulomatriculas/InscripcionCMatrimonio/cursilloMatrimonio.component';
import { ClendarioUsuarioComponent } from './modulocalendario/usuario-evento/CalendarioUsuario.component';
import { ClendarioAdminComponent } from './modulocalendario/administrar-evento/CalendarioAdminitrador.component';
import { MatriculaService } from './modulomatriculas/matriculaalumno-registrado/matricula.service';
import { UsuarioAlumnosservice } from './modulomatriculas/UsuarioAlumno/UsuarioAlumno.service';
import { RepresentanteService } from './modulomatriculas/administrarrepresentantes/administrarrepresentantes.service';
import { PersonaService } from './modulosp/registropersona/persona.service';
import { ClienteComponent } from './modulofactura/cliente/cliente.component';
import { FormreciboComponent } from './modulofactura/recibo/formrecibo/formrecibo.component';
import { CursilloBautizoService } from './modulomatriculas/administrarCBautizo/administrarcbautizo.service';
import { CursilloMatrimonioService } from './modulomatriculas/administrarCMatrimonio/administrarcmatrimonio.service';
import { ReportescapillasComponent } from './modulobodega/reportescapillas/reportescapillas.component';
import { GenerarFacturaComponent } from './moduloventas/generar-factura/generar-factura.component';
import { GenerarRecibosComponent } from './moduloventas/generar-recibos/generar-recibos.component';
import { AdministrarFacturaComponent } from './moduloventas/administrar-factura/administrar-factura.component';
import { AdministrarRecibosComponent } from './moduloventas/administrar-recibos/administrar-recibos.component';
import { IngresarCompraComponent } from './modulocompras/ingresar-compra/ingresar-compra.component';
import { AdministrarCompraComponent } from './modulocompras/administrar-compra/administrar-compra.component';
import { KeyFilterModule } from 'primeng/primeng';
import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';

@NgModule({
  declarations: [

    AppComponent,
    ModuloComponent,
    LoginComponent,
    AppMenuComponent,
    AppSubMenuComponent,

    ServicioslistaComponent,
    TiposdocumentosComponent,
    EmiciondocumentosComponent,
    EmisiondocumentosusuarioComponent,
    ReservacioneucaristiasusuarioComponent,
    ReservacioneucaristiasComponent,
    DocumentopersonasComponent,
    InscripcioneucaristiasComponent,
    DocumentopersonascrearComponent,
    TipoeucaristiasComponent,
    InscripcioneucaristiasusuarioComponent,
    RegistropersonaComponent,

    InventarioComponent,
    ActivosComponent,
    ProveedorComponent,
    CapillaComponent,
    AlmacenComponent,
    ProductoComponent,

    
    AdministrarTipoInscripcionComponent,
    AdministrarPeriodoComponent,
    AulasComponent,
    AdministrarNivelComponent,
    MatriculaalumnoRegistradoComponent,
    DirigentesComponent,
    ConfirmarMatriculasComponent,
    AdministraralumnosComponent,
    AdministrarrepresentantesComponent,
    AdministrarpadrinosComponent,
    UsuarioAlumnosComponent,
    AdministrarcbautizoComponent,
    AdministrarcmatrimonioComponent,
    ClendarioAdminComponent,//llamamos a la clase calendario,
    ClendarioUsuarioComponent,//llamamos a la clase calendarioCliente,
    cursilloBautizoComponent,//llamammos a nuestra clase
    cursilloMatrimoniocomponent,//llamammos a nuestra clase

    
    FormfacturaComponent,
    FormcompraComponent,
    CajaComponent,
    ReportesComponent,
    ReciboComponent,
    FormaperturarcajaComponent,
    FormcerrarcajaComponent,
    ClienteComponent,
    FormreciboComponent,
    ReportescapillasComponent,

    GenerarFacturaComponent,
    GenerarRecibosComponent,
    AdministrarFacturaComponent,
    AdministrarRecibosComponent,
    IngresarCompraComponent,
    AdministrarCompraComponent,
    GestionUsuarioComponent
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MegaMenuModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    HttpClientModule,
    PDFExportModule,
    PanelModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    KeyFilterModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    FullCalendarModule,
    GalleriaModule,
    GrowlModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    MatCheckboxModule,
    SpringGenericMVCModule
  ],
  providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy},
              CarService, CountryService, EventService, NodeService, LoginService,TipodocumentoService,TipoEucaristiaService, InscripcioneucaristiaService, ReservacionEucaristiaService, PersonaService, CalendarioService,MatriculaService, UsuarioAlumnosservice,RepresentanteService, CursilloBautizoService,CursilloMatrimonioService,GenerarFacturaComponent],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
