import { Component, OnInit } from '@angular/core';

import { Persona } from '../../../modulosp/registropersona/persona';
import { Factura } from '../factura';
import { Producto } from '../producto';
import { DetalleFactura } from '../detalle-factura';
import { FacturaService } from '../factura.service';
import swal from 'sweetalert2';
import { Caja } from '../../caja/caja';
import { CajaService } from '../../caja/caja.service';
import { CajaMovimiento } from '../../caja/caja-movimiento';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../cliente/cliente';


@Component({
  selector: 'app-formfactura',
  templateUrl: './formfactura.component.html',
})
export class FormfacturaComponent implements OnInit {

  titulo:string="Facturacion";
  validaboton:boolean=false;
  date3: Date;
  
  productos:Producto[];
  clientes:Cliente[];
  cajas:Caja[];
  
  cliente:Cliente=new Cliente();
  persona:Persona=new Persona();
  factura:Factura=new Factura();
  caja:Caja=new Caja();
  cajamovimiento:CajaMovimiento=new CajaMovimiento();


  constructor(
    private facturaService:FacturaService,
    private cajaservice:CajaService,
    private activatedRoute:ActivatedRoute,
    private router:Router) { }
  
  es:any;
  ngOnInit() {
    /*TRADUCE AL ESPAÑOL EL CALENDAR */
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Deciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Agt", "Sep", "Oct", "Nov", "Dec" ],
      today: 'Hoy',
      clear: 'Borrar',
  };
  this.listarCajas();
  console.log(this.cajas); 
  //this.validarCajaApertura();
  this.factura.factFechaemision=this.getCuurentDate();
}


/* --------  OBTENER FECHA ACTUAL ----------- */
getCuurentDate(): string {
  let today = new Date();
  let numbermounth = today.getUTCMonth() + 1;
  let mounth = '';
  let day = '';

  if (today.getDate() < 10) day = '0' + today.getUTCDate(); else day = today.getDate().toString();
  if (numbermounth < 10) mounth = '0' + numbermounth; else mounth = numbermounth.toString();

  return today.getFullYear() + '-' + mounth + '-' + day;
}

  /* --- BUSCADOR DE PRODUCTOS --- */
  autocompleteProducto(event){
    this.facturaService.buscarProductoFactura(event.query).subscribe(data=>{this.productos=data})
  }

  /* --- BUSCADOR DE DATOS DE CLIENTE --- */ 
  autocompleteCliente(event){
    this.facturaService.buscarClienteFactura(event.query).subscribe(data=>{this.clientes=data});
  }

  /* --- CARGA LOS PRODUCTOS AL DETALLE DE LA FACTURA --- */
  cargarProductos(event):void {

    let producto=event as Producto;
    let valstock=false;
/* ---  validamos la cantidad de stock del producto antes de agregarlo --- */
    if(producto.prodCantidad==0){ 
      swal.fire({
        title: 'Facturacion',
        text: `${(producto.prodNombre)} no posee existencias `,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      })
    }else{

      if(producto.prodCantidad>1 && producto.prodCantidad<=5){
        swal.fire({
          title: '¿Desea realizar esta venta?',
          text: `${(producto.prodNombre)}; solamente posee ${(producto.prodCantidad)} en existencias `,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `Confirmar`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            if(this.validarLineaDetalle(producto.prodId)){
              this.incrementarCantidad(producto.prodId);
          }else{
            let nuevoDetalle=new DetalleFactura();
            nuevoDetalle.producto=producto;
            nuevoDetalle.detfFkProductos=producto.prodId;
            this.factura.detalleFacturaCollection.push(nuevoDetalle);
          }
          } else if (result.isDenied) {
            valstock=false;
          }
        })
        
      }else{
        if(this.validarLineaDetalle(producto.prodId)){
          this.incrementarCantidad(producto.prodId);
        }else{
          let nuevoDetalle=new DetalleFactura();
          nuevoDetalle.producto=producto;
          nuevoDetalle.detfFkProductos=producto.prodId;
          this.factura.detalleFacturaCollection.push(nuevoDetalle);
        }

      }

    }
    
  }

  /* --- CARGA LOS DATOS DEL CLIENTE EN EL FORMULARIO --- */
  cargarCliente(event):void {
    this.cliente=event;
    this.persona=this.cliente.clieFkPersona;
    this.factura.factFkCliente=this.cliente;
  }

  /* --- ACTUALIZA LAS CANTIDADES EL TOTAL,IVA Y SUBTOTAL DE LOS DETALLES --- */
  actualizarCantidad(id:number,event:any):void{
    let cantidad:number=event.target.value as number;

    if(cantidad== 0){ // SI LA CANTIDAD ES CERO ELIMINA EL PRODUCTO DEL DETALLE DE LA FACTURA
      return this.eliminarDetalle(id);
    }
    this.factura.detalleFacturaCollection=this.factura.detalleFacturaCollection.map((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){
        detalle.detfCantidad=cantidad; //acutalizamos el campo cantidad dentro del array
        detalle.detfSubtotal=detalle.calcularTotalProducto();
        detalle.detfIva=detalle.detfSubtotal*0.12;
        console.log(detalle.detfSubtotal,detalle.detfCantidad,detalle.detfIva);
      }
      return detalle;
    });
  }

  /* --- VALIDACIONES DE DETALLE DE FACTURA  --- */
  validarLineaDetalle(id:number):boolean{
    let existeprod=false;
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){
        existeprod=true;
      }
    });
    return existeprod;
  }

/* --- INCREMENTAR LA CANTIDAD DE LOS PRODUCTOS REPETIDOS EN EL DETALLE --- */
  incrementarCantidad(id:number):void{
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){
        ++detalle.detfCantidad;
      }
    });
  }
/* --- ELIMINA EL PRODUCTO DEL DETALLE --- */
  eliminarDetalle(id:number):void{
    this.factura.detalleFacturaCollection=this.factura.detalleFacturaCollection.filter((detalle:DetalleFactura)=>id!==detalle.producto.prodId);
  }


/* --- REGISTRA LA FACTURA EN LA BASE DE DATOS --- */
  crearFactura(facturaForm):void{
    console.log(this.factura);
    if (facturaForm.form.valid && this.factura.detalleFacturaCollection.length > 0) {
    swal.fire({
      title:this.titulo,
      text:'¿Desea emitir la siguiente factura?',
      showCancelButton: true,
      confirmButtonText: `Confirmar`,
      denyButtonText: `Cancelar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.facturaService.crearFactura(this.factura).subscribe(factura=>{
          this.actualizarStock();
          this.generarCajaMovimiento();
          swal.fire(this.titulo,`Factura Nro ${factura.factNumdocumento} creada con exito`,'success')
          this.validaboton=true;
        });    
      } else if (result.isDenied) {
        this.validaboton=true;
        result.dismiss === swal.DismissReason.cancel
      }
    })
  }else{
    swal.fire(this.titulo,`Llene todos los Campos de la Factura`,'error');
  }
   
  }

  /* --- ACTUALIZA EL STOCK DEL PRODUCTO EN INVENTARIO ---- */
  actualizarStock():void{
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      this.facturaService.actualizarStock(detalle.detfFkProductos,detalle.detfCantidad).subscribe(producto=>{
        console.log(producto);
      });
    });
  }

  /* ---- LISTA TODAS LAS CAJAS DEL SISTEMA ---- */
  listarCajas():void{
    this.cajaservice.cargarCaja("ABIERTO").subscribe(data=>{this.cajas=data});
  }

 
  /* --- CARGA LOS DATOS DE LA CAJA SELECCIONADA --- */
  cargarDatosCaja(event):void{
    this.caja=event.value;
    console.log(this.caja);
  }

  /* --- GENERA EL MOVIMIENTO DE CAJA PARA LA VENTA --- */
  generarCajaMovimiento():void{
    this.cajamovimiento.cajmEstado='ACTIVO';
    this.cajamovimiento.cajmMonto=this.factura.factTotal;
    this.cajamovimiento.cajmFecha=this.factura.factFechaemision;
    this.cajamovimiento.cajmTipo='VENTA';
    this.cajamovimiento.cajmFkCaja=this.caja;
    console.log(this.cajamovimiento);
    this.cajaservice.crearMovimientoCaja(this.cajamovimiento).subscribe(cajamovimiento=>{
      
    }) 
  
  }
 
  validarCajaApertura():void{
    console.log(this.cajas);
    /*if(this.cajas.length==0){
      swal.fire({
        title: 'Facturacion',
        text: 'Debe aperturar caja para realizar una venta',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
         this.router.navigate(['facturacion/caja-apertura']);
        } 
      })
    }*/
  }


}