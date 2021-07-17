import { Component, OnInit } from '@angular/core';

import swal from 'sweetalert2';

import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { Cliente } from 'src/app/modulofactura/cliente/cliente';
import { FacturaService } from '../administrar-factura/factura.service';
import { DetalleFactura } from '../administrar-factura/detalle-factura';
import { Caja } from 'src/app/modulofactura/caja/caja';
import { CajaService } from 'src/app/modulofactura/caja/caja.service';
import { CajaMovimiento } from 'src/app/modulofactura/caja/caja-movimiento';
import { Producto } from '../administrar-factura/producto';
import { Factura } from '../administrar-factura/factura';
import { Almacen } from 'src/app/modulobodega/almacen/almacen';
import { AlmacenService } from 'src/app/modulobodega/almacen/almacen.service';
import { ProductoService } from 'src/app/modulobodega/productos/producto.service';


@Component({
  selector: 'app-generar-factura',
  templateUrl: './generar-factura.component.html',
})
export class GenerarFacturaComponent implements OnInit {

  /* -------- VARIABLES  -------- */
  titulo:string="Facturacion";
  validaboton:boolean=false;
  subtotaldetalle:number=0.00;
  subtotaldetalleiva:number=0.00;
  valordescuento:number=0.00;
  date3: Date;
  dis:boolean;
  dis2:boolean;
  disfactura:boolean;
  es:any;
  sucursal:number=1;
  matriz:number=1;
  facturasecuencia:number=0;
  fechaemision: string;

  /* -------- COLECCIONES  -------- */
  productos:Producto[];
  clientes:Cliente[];
  cajas:Caja[];
  almacenes = new Array<Almacen>();
  almacen: Almacen = new Almacen();

  productosAlmacenF = new Array<Producto>();
  
  /* -------- OBJETOS  -------- */
  cliente:Cliente=new Cliente();
  persona:Persona=new Persona();
  factura:Factura=new Factura();
  caja:Caja=new Caja();
  cajamovimiento:CajaMovimiento=new CajaMovimiento();


  constructor(
  private facturaService:FacturaService,
  private cajaservice:CajaService,
  private activatedRoute:ActivatedRoute,
  private router:Router,
  private AlmacenServicio : AlmacenService ,
  private ProductoServicio : ProductoService
  ) { }
  

  ngOnInit() {
    /* ----------- TRADUCE AL ESPAÑOL LAS CONFIGURACIONES EL COMPONENTE CALENDAR -------------- */
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
  let date = new Date();
  this.fechaemision = this.getCuurentDate(date);
  date.setDate(date.getDate() + 1);
  this.factura.factFechaemision=this.getCuurentDate(date);
  this.generarNumFactura();
  this.listaralmacenes();
  this.listarproductos();
}

/* --------  LISTAR ALMACENES ----------- */

listaralmacenes(){
  this.AlmacenServicio.listarAlmacen().subscribe(data => {
    this.almacenes = data;
  });
}

/* --------  LISTAR PRODUCTOS ----------- */

listarproductos(){
  this.ProductoServicio.listarProducto().subscribe(data => {
    this.productos = data;
  });
}

/* --------  GESTIONAR LA VENTANA DE CLIENTES DENTRO DE LA FACTURA ----------- */
gestionarcliente(){
  this.dis=true;
}

/* --------  GESTIONAR LA VENTANA DE CLIENTES DENTRO DE LA FACTURA ----------- */
VerProductosAlmacen(){
  this.dis2=true;
}


/* --------  FUNCION PARA OBTENER LA FECHA ACTUAL PARA LA EMISION DE LA FACTURA ----------- */
getCuurentDate(today: Date): string {
  let numbermounth = today.getUTCMonth() + 1;
  let mounth = '';
  let day = '';
  
  if (today.getDate() < 10) day = '0' + today.getUTCDate(); else day = today.getDate().toString();
  if (numbermounth < 10) mounth = '0' + numbermounth; else mounth = numbermounth.toString();

  return today.getFullYear() + '-' + mounth + '-' + day;
}


  /* ------------ FUNCION DE BUSCADOR DE PRODUCTOS -------------- */
  autocompleteProducto(event){
    this.facturaService.buscarProductoFactura(event.query).subscribe(data=>{this.productos=data})
  }


  /* ------------ FUNCION DE BUSCADOR DE DATOS DEL CLIENTE ------------- */ 
  autocompleteCliente(event){
    this.facturaService.buscarClienteFactura(event.query).subscribe(data=>{this.clientes=data});
  }


  /* ---------------- FUNCION QUE CARGA LOS PRODUCTOS SELECCIONADOS AL DETALLE DE LA FACTURA --------- */
  cargarProductos(event):void {
    let producto=event as Producto;
    let valstock=false;
 /* ---  validamos la cantidad de stock del producto antes de agregarlo al detalle --- */
    if(producto.prodCantidad==0){  // si el stock es 0
      this.dis2=false;
      swal.fire({
        title: 'Facturacion',
        text: `${(producto.prodNombre)} no posee existencias `,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      })
    }else{

      if(producto.prodCantidad>1 && producto.prodCantidad<=5){ // Si el stock es igual a 5 o inferior
        this.dis2=false;
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
            if(this.validarLineaDetalle(producto.prodId)){ //validamos si el producto ya esta ingresado
              this.incrementarCantidad(producto.prodId); //si ya esta ingresado incrementamos su cantidad
          }else{
            this.cargarDatosDetalle(producto);
          }
          this.dis2=true;
          } else if (result.isDenied) {
            valstock=false;
            this.dis2=false;
          }
        })
        
      }else{
        if(this.validarLineaDetalle(producto.prodId)){
          this.incrementarCantidad(producto.prodId);
        }else{
          this.cargarDatosDetalle(producto);
        }
      }
    }
  }




  /* -------------- CARGA LOS DATOS DEL DETALLE DE LA FACTURA Y CALCULA SUBTOTAL,IVA,DESCUENTO DE CADA PRODUCTO AGREGADO -----------------*/
  cargarDatosDetalle(producto:Producto){
    let nuevoDetalle=new DetalleFactura();
    nuevoDetalle.producto=producto;
    nuevoDetalle.detfFkProductos=producto;
    nuevoDetalle.detfSubtotal=parseFloat(nuevoDetalle.calcularTotalProducto().toFixed(2));
    if(nuevoDetalle.producto.prodIva==true){
    this.subtotaldetalleiva=nuevoDetalle.detfSubtotal*0.12;
    }else{
      this.subtotaldetalleiva=0;
    }       
    nuevoDetalle.detfIva=parseFloat(this.subtotaldetalleiva.toFixed(2));
    console.log(nuevoDetalle);
    this.factura.detalleFacturaCollection.push(nuevoDetalle);
  }




  /* ------------------ CARGA LOS DATOS DEL CLIENTE EN LA FACTURA ---------------------- */
  cargarCliente(event):void {
    this.cliente=event;
    this.persona=this.cliente.clieFkPersona;
    this.factura.factFkCliente=this.cliente;
  }




  /* ------------------ ACTUALIZA LAS CANTIDADES EL TOTAL,IVA Y SUBTOTAL DE LOS DETALLES ----------------- */
  actualizarCantidad(id:number,event:any):void{

    let cantidad:number=event.target.value as number;

    /* VALIDACION DE LA CANTIDAD DE VENTA Y LA STOCK DE UN PRODUCTO */
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){

        //Valida el numero de existencias 
          if(cantidad>detalle.producto.prodCantidad){ 
            swal.fire(this.titulo,`La cantidad supera el nro de existencias`,'error');
            cantidad=1;
            event.target.value=1;
          }
          //Valida que el numero de existencias no sea negativo
          if(cantidad<0){
            swal.fire(this.titulo,`La cantidad ingresada debe ser mayor que 0`,'error');
            cantidad=1;
            event.target.value=1;
          }

      }
    });


    if(cantidad===0){ // SI LA CANTIDAD ES CERO ELIMINA EL PRODUCTO DEL DETALLE DE LA FACTURA
      return this.eliminarDetalle(id);
    }
  

    this.factura.detalleFacturaCollection=this.factura.detalleFacturaCollection.map((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){
        detalle.detfCantidad=cantidad; //acutalizamos el campo cantidad dentro del array
        detalle.detfSubtotal=parseFloat(detalle.calcularTotalProducto().toFixed(2));
       
        if(detalle.producto.prodIva==true){
        this.subtotaldetalleiva=detalle.detfSubtotal*0.12;
        }else{
          this.subtotaldetalleiva=0;
        }       
        detalle.detfIva=parseFloat(this.subtotaldetalleiva.toFixed(2));
      }
      
      return detalle;
    });

  }




  /* ------------------- CALCULA EL VALOR DEL DESCUENTO EN BASE AL PORCENTAJE DE DESCUENTO QUE INGRESAMOS -------------------*/
  actualizarDescuento(id:number,event:any):void{
    let cantidad:number=event.target.value as number;
  
    this.factura.detalleFacturaCollection=this.factura.detalleFacturaCollection.map((detalle:DetalleFactura)=>{
   
      if(cantidad>=100){
        swal.fire(this.titulo,`El descuento no puede ser mayor al 99%`,'error');
        event.target.value=0;
      }else{
        if(cantidad>=0){
          if(id===detalle.producto.prodId){
            this.valordescuento=detalle.calcularTotalProducto()*(cantidad/100);
            detalle.detfDescuento=parseFloat(this.valordescuento.toFixed(2));
            detalle.detfPdescuento=cantidad;
          }
        }else{
          event.target.value=0;
          swal.fire(this.titulo,`El descuento no puede ser menor a %0`,'error');
        }
      }
     
    return detalle;
    });
  }



  /* ----------------------- FUNCION QUE VALIDA SI UN PRODUCTO YA ESTA SELECCIONADO  ----------------------- */
  validarLineaDetalle(id:number):boolean{
    let existeprod=false;
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){
        existeprod=true;
      }
    });
    return existeprod;
  }



/* ---------------------- FUNCION PARA INCREMENTAR LA CANTIDAD DE LOS PRODUCTOS REPETIDOS EN EL DETALLE DE LA FACTURA -------------------------- */
  incrementarCantidad(id:number):void{
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      if(id===detalle.producto.prodId){
        ++detalle.detfCantidad;
        detalle.detfSubtotal=parseFloat(detalle.calcularTotalProducto().toFixed(2));
        if(detalle.producto.prodIva==true){
        this.subtotaldetalleiva=detalle.detfSubtotal*0.12;
        }else{
          this.subtotaldetalleiva=0;
        }       
        detalle.detfIva=parseFloat(this.subtotaldetalleiva.toFixed(2));
      }
    });
  }



/* ---------------------------- FUNCION PARA ELIMINAR EL PRODUCTO DEL DETALLE DE LA FACTURA ------------------------------- */
  eliminarDetalle(id:number):void{
    this.factura.detalleFacturaCollection=this.factura.detalleFacturaCollection.filter((detalle:DetalleFactura)=>id!==detalle.producto.prodId);
  }



/* ----------------------- FUNCION PARA REGISTRAR LA FACTURA EN LA BASE DE DATOS ---------------------------------- */
  crearFactura(facturaForm):void{
    console.log(this.factura);
    
          if (this.validaCampos()) {  //VALIDA SI TODOS LOS DATOS ESTAN LLENOS
            swal.fire({
              title:this.titulo,
              text:'¿Desea emitir la siguiente factura?',
              showCancelButton: true,
              confirmButtonText: `Confirmar`,
              denyButtonText: `Cancelar`,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            }).then((result) => {
              if (result.isConfirmed) {
                this.facturaService.crearFactura(this.factura).subscribe(factura=>{
                  this.actualizarStock();
                  this.generarCajaMovimiento(factura.factId);
                  swal.fire(this.titulo,`Factura Nro ${factura.factNumdocumento} creada con exito`,'success')
                  this.validaboton=true;
                });    
              } else if (result.isDenied) {
                this.validaboton=true;
                result.dismiss === swal.DismissReason.cancel
              }
            })
        }
    }




  /* ---------------------------  FUNCION PARA ACTUALIZAR EL STOCK DEL PRODUCTO EN INVENTARIO ------------------------- */
  actualizarStock():void{
    this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
      this.facturaService.actualizarStock(detalle.detfFkProductos.prodId,detalle.detfCantidad).subscribe(producto=>{});
    });
  }



  /* -----------------------FUNCION PARA LISTAR Y VALIDAR TODAS LAS CAJAS APERTURADAS DEL SISTEMA ------------------------- */
  listarCajas():void{
    this.cajaservice.cargarCaja("ABIERTO").subscribe(data=>{
      this.cajas=data;
      if(this.cajas.length==0){  
        swal.fire({
          title: 'Facturacion',
          text: 'Debe aperturar caja para realizar una venta',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
           this.router.navigate(['facturacion/caja-apertura']);
          } 
        })
      }

    });
  }


 
  /* ---------------------- FUNCION PARA CARGAR LOS DATOS DE LA CAJA SELECCIONADA POR EL USUARIO ------------------ */
  cargarDatosCaja(event):void{
    this.caja=event.value;
    console.log(this.caja);
  }


  /* ----------------------- FUNCION PARA GENERAR EL MOVIMIENTO DE CAJA PARA LA VENTA ---------------------------- */
  generarCajaMovimiento(iddoc):void{
    this.cajamovimiento.cajmEstado='ACTIVO';
    this.cajamovimiento.cajmMonto=this.factura.factTotal;
    this.cajamovimiento.cajmFecha=this.factura.factFechaemision;
    this.cajamovimiento.cajmTipo='VENTA';
    this.cajamovimiento.cajmFkCaja=this.caja;
    this.cajamovimiento.cajmIdDoc=iddoc;
    this.cajamovimiento.cajmHoraemisionDoc = this.formatTime();
    this.cajamovimiento.cajmNumDoc=this.factura.factNumdocumento;
    this.cajaservice.crearMovimientoCaja(this.cajamovimiento).subscribe(cajamovimiento=>{}) 
  
  }

  /* ----------------------- FUNCION PARA GENERAR LA HORA DE EMISION DEL DOCUMENTO ---------------------------- */
  formatTime(): string{
    let date = new Date();
    let hours = "00";
    let minutes = "00";
    if(date.getHours() < 10) {hours = "0" + date.getHours()} else {hours = date.getHours().toString()};
    if(date.getMinutes() < 10){minutes = "0" +  date.getMinutes()}else{minutes = date.getMinutes().toString()};
    return hours+":"+minutes;
  }

  /* ------------------------------------ FUNCION PARA GENERAR SECUENCIAS DE NUMEROS DE FACTURA ------------------------------------ */
  generarNumFactura():void{
    this.facturaService.getFacturalastinsertId().subscribe(data=>{
      let numdocumento:string="";
      let dimensionmatriz:number=3-this.matriz.toString().length;
      let dimensionsucursal:number=3-this.sucursal.toString().length;
      let secuenciafactura:number=9-(data+1).toString().length;  
      
            //Secuencia de matriz
      for (let index = 0; index < 3; index++) {
          if(index==dimensionmatriz){
            numdocumento+=this.matriz+"-";
            break;
          }else{
            numdocumento+="0";
          }
      }
      //Secuencia de sucursal
      for (let index2 = 0; index2 < 3; index2++) {
        if(index2==dimensionsucursal){
          numdocumento+=this.sucursal+"-";
          break;
        }else{
          numdocumento+="0";
        }
      }
      //Secuencia de facturas
      for (let index3 = 0; index3< 9; index3++) {
        if(index3==secuenciafactura){
          numdocumento+=data+1;
          break;
        }else{
          numdocumento+="0";
        }
      }

     this.factura.factNumdocumento=numdocumento;

    });
     
  }
 
  /* ----------------------------VALIDA QUE SE SELECCIONE UN ALMACEN ------------------------------ */
  validaAlmacen(){
    if(this.almacen.almaId==null){
      swal.fire(this.titulo,`Seleccione un almacen`,'error');
    }else{
      this.VerProductosAlmacen();
    }
  }


  /* --------------------------- VALIDA CAMPOS DEL FORMULARIO ---------------------------*/
public validaCampos():boolean{

  let mensajes=new Array<string>();
/* ------- VALIDA LOS CAMPOS NECESARIOS PARA REALIZAR LA FACTURACION --------------- */ 
  if(this.cliente.clieId==null){
   mensajes.push("Ingrese los datos del cliente en la factura");
  }

  if(this.factura.detalleFacturaCollection.length==0 || this.factura.detalleFacturaCollection==null){
    mensajes.push("Seleccione un producto para el detalle de la Factura");
  }

  if(this.caja.cajaId==null){
    mensajes.push("Seleccione una caja para el registro de la factura");
  }

  if(this.cajamovimiento.cajmObservaciones==null){
    mensajes.push("Ingrese una observacion para la venta");
  }

  /* ----- CONSTRUYE EL MENSAJE DE VALIDACION DE LOS ERRORES -------*/
  if(mensajes.length>0){
      let html:string=""
      let j:number=1;

      for (let i = 0; i < mensajes.length; i++) {
          html+=j+".- "+mensajes[i]+'<br>';
          j++;
      }
      
      swal.fire({
        icon: 'error',
        title: this.titulo,
        html: html,
      })

      return false;
    }else{
    return true;
  }

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

 /*----------------------- FILTRO DE PRODUCTOS POR ALMACEN---------------------------------*/

  FiltroProductosAlmacen(event):void{
    this.listarproductos();
    this.almacen=event.value;
    if (this.almacen  == null) {
      this.productosAlmacenF = this.productos;
    }else{
      this.productosAlmacenF = [];
      for (let i = 0; i < this.productos.length; i++) {
        if (this.almacen.almaNombre == this.productos[i].prodFkAlmacen.almaNombre) {
          this.productosAlmacenF.push(this.productos[i]);
        }
      }
    }
  }


  /* PERMITA VISUALIZAR LA VENTANA DE IMPRESION DE LA FACTURA AL GUARDARLA */
  imprimirFactura():void{
    this.disfactura=true;
  }


}


