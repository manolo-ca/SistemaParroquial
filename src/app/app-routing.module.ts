import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { ModuloComponent } from './Inicio/modulo/modulo.component';


import { ServicioslistaComponent } from './modulosp/administrar/servicioslista/servicioslista.component';

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

import { InventarioComponent} from './modulobodega/inventarios/inventario.component';
import { ActivosComponent } from './modulobodega/activos/activos.component';
import { ProveedorComponent } from './modulobodega/proveedores/proveedor.component';
import { CapillaComponent } from './modulobodega/capillas/capilla.component';
import { AlmacenComponent } from './modulobodega/almacen/almacen.component';
import { ProductoComponent } from './modulobodega/productos/producto.component';
import { ReportescapillasComponent } from './modulobodega/reportescapillas/reportescapillas.component';

import { FormfacturaComponent } from './modulofactura/factura/formulariofactura/formfactura.component';
import { FormcompraComponent } from './modulofactura/compra/compraformulario/formcompra.component';
import { CajaComponent } from './modulofactura/caja/cajagestion/caja.component';
import { FormaperturarcajaComponent } from './modulofactura/caja/aperturacaja/formaperturarcaja.component';
import { FormcerrarcajaComponent } from './modulofactura/caja/cerrarcaja/formcerrarcaja.component';
import { ReportesComponent } from './modulofactura/reportes/reportes.component';
import { ReciboComponent } from './modulofactura/recibo/recibo.component';
import { AdministraralumnosComponent } from './modulomatriculas/AdministrarAulmno/AdministrarAlumno.component';
import { AdministrarPeriodoComponent } from './modulomatriculas/administrar-Periodos/Periodo.component';
import { AdministrarNivelComponent } from './modulomatriculas/administrar-Niveles/Niveles.component';
import { DirigentesComponent } from './modulomatriculas/administrarDirigentes/Dirigentes.component';
import { AdministrarTipoInscripcionComponent } from './modulomatriculas/administrar-tipo-inscripcion/administrar-tipo-inscripcion.component';
import { UsuarioAlumnosComponent } from './modulomatriculas/UsuarioAlumno/UsuarioAlumno.component';
import { ClendarioAdminComponent } from './modulocalendario/administrar-evento/CalendarioAdminitrador.component';
import { ClendarioUsuarioComponent } from './modulocalendario/usuario-evento/CalendarioUsuario.component';
import { cursilloBautizoComponent } from './modulomatriculas/InscripcionCBautizo/cursilloBautizo.component';
import { cursilloMatrimoniocomponent } from './modulomatriculas/InscripcionCMatrimonio/cursilloMatrimonio.component';
import { AdministrarcbautizoComponent } from './modulomatriculas/administrarCBautizo/administrarcbautizo.component';
import { AdministrarcmatrimonioComponent } from './modulomatriculas/administrarCMatrimonio/administrarcmatrimonio.component';
import { MatriculaalumnoRegistradoComponent } from './modulomatriculas/matriculaalumno-registrado/matriculaalumno-registrado.component';
import { AdministrarrepresentantesComponent } from './modulomatriculas/administrarrepresentantes/administrarrepresentantes.component';
import { AulasComponent } from './modulomatriculas/administrar-aulas/Aulas.component';
import { ClienteComponent } from './modulofactura/cliente/cliente.component';
import { FormreciboComponent } from './modulofactura/recibo/formrecibo/formrecibo.component';
import { GenerarFacturaComponent } from './moduloventas/generar-factura/generar-factura.component';
import { AdministrarFacturaComponent } from './moduloventas/administrar-factura/administrar-factura.component';
import { GenerarRecibosComponent } from './moduloventas/generar-recibos/generar-recibos.component';
import { AdministrarRecibosComponent } from './moduloventas/administrar-recibos/administrar-recibos.component';
import { AdministrarCompraComponent } from './modulocompras/administrar-compra/administrar-compra.component';
import { IngresarCompraComponent } from './modulocompras/ingresar-compra/ingresar-compra.component';
import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';
import { AppComponent } from './app.component';





const routes: Routes = [

  {path: 'Login', 
  component: AppComponent,  
  pathMatch: 'full'
  },

 {path: 'Inicio', 
  component: ModuloComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/eucaristia-inscripcion', 
  component:  InscripcioneucaristiasComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/eucaristia-tipos', 
  component: TipoeucaristiasComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/servicios-lista', 
  component: ServicioslistaComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/documentos-tipos', 
  component: TiposdocumentosComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/documentos-emision', 
  component: EmiciondocumentosComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/usuario/documentos-emision-usuario', 
  component: EmisiondocumentosusuarioComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/usuario/eucaristia-reservacionusuario', 
  component: ReservacioneucaristiasusuarioComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/eucaristia-reservacion', 
  component: ReservacioneucaristiasComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/administrar/documentos-persona', 
  component: DocumentopersonasComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/documentos-persona-crear/:persId', 
  component: DocumentopersonascrearComponent,  
  pathMatch: 'full'
  },
  {path: 'serviciospastorales/usuario/eucaristia-inscripcion-usuario', 
  component: InscripcioneucaristiasusuarioComponent,  
  pathMatch: 'full'
  },
  {path: 'resgistro-personas', 
  component: RegistropersonaComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/capillas', 
  component: CapillaComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/almacenes', 
  component: AlmacenComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/productos', 
  component: ProductoComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/inventario', 
  component: InventarioComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/activos', 
  component: ActivosComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/proveedores', 
  component: ProveedorComponent,  
  pathMatch: 'full'
  },
  {path: 'bodega/reportescapillas', 
  component: ReportescapillasComponent,  
  pathMatch: 'full'
  },
  {path: 'facturacion/clientes', 
  component:ClienteComponent, 
  pathMatch:'full'
  },
  {path: 'facturacion/facturar', 
  component:FormfacturaComponent, 
  pathMatch:'full'
  },
  {path: 'facturacion/comprar', 
  component:FormcompraComponent , 
  pathMatch:'full'
  },
  {path: 'facturacion/caja', 
  component:CajaComponent, 
  pathMatch:'full'
  },
  {path: 'facturacion/caja-apertura', 
  component:FormaperturarcajaComponent, 
  pathMatch:'full'
  },
  {path: 'facturacion/caja-cerra', 
  component:FormcerrarcajaComponent, 
  pathMatch:'full'
  },
  {path: 'facturacion/reportes', 
  component:ReportesComponent, 
  pathMatch:'full'
  },
  {path: 'facturacion/recibo', 
  component:ReciboComponent , 
  pathMatch:'full'
  },
  {path: 'facturacion/recibo/registrar', 
  component:FormreciboComponent , 
  pathMatch:'full'
  },


  //NUEVOS PATH MÓDULO FACTURACIÓN, VENTA Y COMPRAS

  {path: 'sistemaparroquial/ventas/facturar', 
  component:GenerarFacturaComponent , 
  pathMatch:'full'
  },

  {path: 'sistemaparroquial/ventas/recibo', 
  component:GenerarRecibosComponent, 
  pathMatch:'full'
  },

  {path: 'sistemaparroquial/ventas/administrar/facturas', 
  component:AdministrarFacturaComponent, 
  pathMatch:'full'
  },

  {path: 'sistemaparroquial/ventas/administrar/recibos', 
  component:AdministrarRecibosComponent, 
  pathMatch:'full'
  },

  {path: 'sistemaparroquial/compras/ingreso', 
  component:IngresarCompraComponent, 
  pathMatch:'full'
  },

  {path: 'sistemaparroquial/usuario/administrar-usuario', 
  component:GestionUsuarioComponent, 
  pathMatch:'full'
  },

  {path: 'sistemaparroquial/compras/administrar', 
  component:AdministrarCompraComponent, 
  pathMatch:'full'
  },

  {path:'alumnos',component: AdministraralumnosComponent},
  {path:'periodos',component: AdministrarPeriodoComponent},
  {path:'niveles',component: AdministrarNivelComponent},
  {path:'dirigentes',component: DirigentesComponent},
  {path:'administrarTipoInscripcion',component: AdministrarTipoInscripcionComponent},
  {path:'matriculaCatequesis',component:  UsuarioAlumnosComponent},
  {path:'calendarioAdmministrador',component: ClendarioAdminComponent},
  {path:'calendarioCliente',component: ClendarioUsuarioComponent},
  {path:'cursillobautizo',component: cursilloBautizoComponent},
  {path:'cursillomatrimonio',component: cursilloMatrimoniocomponent},
  {path:'aula',component: AulasComponent},
  {path:'matriculas/administrar/cbautizo',component: AdministrarcbautizoComponent},
  {path:'matriculas/administrar/cmatrimonio',component: AdministrarcmatrimonioComponent},
  {path:'matriculas/administrar/matriculados',component: MatriculaalumnoRegistradoComponent},
  {path:'matriculas/administrar/representante',component: AdministrarrepresentantesComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});