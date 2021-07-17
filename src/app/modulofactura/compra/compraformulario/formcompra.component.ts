import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../proveedor';
import { Persona } from '../../../modulosp/registropersona/persona';
import { Compra } from '../compra';
import { Almacen } from '../../../modulobodega/almacen/almacen';
import { AlmacenService } from '../../../modulobodega/almacen/almacen.service';
import { Producto } from '../producto';
import { DetalleCompra } from '../detalle-compra';
import { CompraService } from '../compra.service';
import swal from 'sweetalert2';
import { Inventario } from '../inventario';


@Component({
  selector: 'app-formcompra',
  templateUrl: './formcompra.component.html',
})
export class FormcompraComponent implements OnInit {

  titulo:string="Compra";
  validaboton:boolean=false;
  
  productos:Producto[];
  proveedores:Proveedor[];
  inventarios:Inventario[];
  almacenes:Almacen[];

  proveedor:Proveedor=new Proveedor();
  persona:Persona=new Persona();
 compra:Compra=new Compra();
 inventario:Inventario= new Inventario();
 almacen:Almacen=new Almacen();

  constructor(
    private compraService:CompraService,
    private almacenservice:AlmacenService
    ) { }
 
  es:any;
  ngOnInit() {
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
  this.listarAlmacen();
  console.log(this.almacenes); 
  }

  /* --- BUSCADOR DE PRODUCTOS --- */
  autocompleteProducto(event){
    this.compraService.buscarProductoCompra(event.query).subscribe(data=>{this.productos=data})
  }
   /* --- BUSCADOR DE Inventario --- */
   autocompleteInventario (event){
    this.compraService.buscarInventarioCompra(event.query).subscribe(data=>{this.inventarios=data})
  }
  /* --- BUSCADOR DE PROVEEDOR --- */
  autocompleteProveedor(event){
    this.compraService.buscarProveedorCompra(event.query).subscribe(data=>{this.proveedores=data})
  }
  
/* --- CARGA PRODUCTOS AL DETALLE DE LA COMPRA --- */
  cargarProductos(event):void {
    let producto=event as Producto;

    if(this.validarLineaDetalle(producto.prodId)){
        this.incrementarCantidad(producto.prodId);
    }else{
      let nuevoDetalle=new DetalleCompra();
      nuevoDetalle.producto=producto;
      nuevoDetalle.detfFkProductos=producto.prodId;
      this.compra.detalleCompraCollection.push(nuevoDetalle);
    }
    
  }
  
  /* --- CARGA INVENTARIO AL DETALLE DE LA COMPRA --- */

 
  cargarInventario(event):void {
    let inventario=event as Inventario;

    if(this.validarLineaDetalleInventario(inventario.inveId)){
        this.incrementarCantidadInventario(inventario.inveId);
    }else{
      let nuevoDetalle=new DetalleCompra();
      nuevoDetalle.inventario=inventario;
      nuevoDetalle.detfFkInventarios=inventario.inveId;
      this.compra.detalleCompraCollection.push(nuevoDetalle);
    }
    
  }



  /* --- CARGA LOS DATOS DEL PROVEEDOR EN EL FORMULARIO --- */
  cargarProveedor(event):void {
    this.proveedor=event;
    this.persona=this.proveedor.provFkPersona;
    console.log(this.persona);
    this.compra.compFkProveedor=this.proveedor; 
  }
 

  /* --- ACTUALIZA LAS CANTIDADES EL TOTAL,IVA Y SUBTOTAL DE LOS DETALLES --- */
  actualizarCantidad(id:number,event:any):void{
    let cantidad:number=event.target.value as number;

    if(cantidad== 0){ // SI LA CANTIDAD ES CERO ELIMINA EL PRODUCTO DEL DETALLE 
      return this.eliminarDetalle(id);
    }
    this.compra.detalleCompraCollection=this.compra.detalleCompraCollection.map((detalle:DetalleCompra)=>{
      if(id===detalle.producto.prodId ){
        detalle.detfCantidad=cantidad;
        //detalle.detfCantidad+detalle.dettExistencias; //acutalizamos el campo cantidad dentro del array
        detalle.detfSubtotal=detalle.calcularTotalProducto();
        detalle.detfIva=detalle.detfSubtotal*0.12;
        console.log(detalle.detfSubtotal,detalle.detfCantidad,detalle.detfIva);
      }
      return detalle;
    });
  }
  /* --- ACTUALIZA LAS CANTIDADES EL TOTAL,IVA Y SUBTOTAL DE LOS DETALLES INVENTARIO--- */
  actualizarCantidadInventario(id:number,event:any):void{
    let cantidad:number=event.target.value as number;
   

    if(cantidad== 0){ // SI LA CANTIDAD ES CERO ELIMINA EL PRODUCTO DEL DETALLE 
      return this.eliminarDetalleInventario(id);
    }
    this.compra.detalleCompraCollection=this.compra.detalleCompraCollection.map((detalle:DetalleCompra)=>{
      if(id===detalle.inventario.inveId ){
        detalle.detfCantidad=cantidad;
        //detalle.detfCantidad+detalle.dettExistencias; //acutalizamos el campo cantidad dentro del array
        detalle.detfSubtotal=detalle.calcularTotalInventario();
        detalle.detfIva=detalle.detfSubtotal*0.12;
        console.log(detalle.detfSubtotal,detalle.detfCantidad,detalle.detfIva);
      }
      return detalle;
    });
  }


  /* --- VALIDACIONES DE DETALLE DE COMPRA  --- */
  validarLineaDetalle(id:number):boolean{
    let existeprod=false;
    this.compra.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
      if(id===detalle.producto.prodId ){
        existeprod=true;
      }
    });
    return existeprod;
  }
  
  /* --- VALIDACIONES DE DETALLE DE COMPRA INVENTARIO  --- */
  validarLineaDetalleInventario(id:number):boolean{
    let existeinv=false;
    this.compra.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
      if(id===detalle.inventario.inveId ){
        existeinv=true;
      }
    });
    return existeinv;
  }

/* --- INCREMENTAR LA CANTIDAD DE LOS PRODUCTOS REPETIDOS EN EL DETALLE --- */
  incrementarCantidad(id:number):void{
    this.compra.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
      if(id===detalle.producto.prodId){
        ++detalle.detfCantidad;
      }
    });
  }
  incrementarCantidadInventario(id:number):void{
    this.compra.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
      if(id===detalle.inventario.inveId){
        ++detalle.detfCantidad;
      }
    });
  }
  
/* --- ELIMINA EL PRODUCTO DEL DETALLE --- */
  eliminarDetalle(id:number):void{
    this.compra.detalleCompraCollection=this.compra.detalleCompraCollection.filter((detalle:DetalleCompra)=>id!==detalle.producto.prodId);
  }/* --- ELIMINA INVENTEARIO DEL DETALLE --- */
  eliminarDetalleInventario(id:number):void{
    this.compra.detalleCompraCollection=this.compra.detalleCompraCollection.filter((detalle:DetalleCompra)=>id!==detalle.inventario.inveId);
  }

/* --- REGISTRA LA COMPRA EN LA BASE DE DATOS --- */
  crearCompra(compraForm):void{
    if (compraForm.form.valid && this.compra.detalleCompraCollection.length > 0) {
      swal.fire({
        title:this.titulo,
        text:'¿Desea guardar la siguiente compra?',
        showCancelButton: true,
        confirmButtonText: `Confirmar`,
        denyButtonText: `Cancelar`,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
     this.compraService.crearCompra(this.compra).subscribe(compra=>{
      this.sumarStock();
      this.sumarStockInventario();
      swal.fire(this.titulo,`Compra Nro ${compra.compNumdocumento} creada con exito`,'success')
      this.validaboton=true;
    });    
  } else if (result.isDenied) {
    this.validaboton=true;
    result.dismiss === swal.DismissReason.cancel
  }
    })
  }
}
/* --- ACTUALIZA EL STOCK DEL PRODUCTO EN INVENTARIO ---- */
sumarStock():void{
  this.compra.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
    this.compraService.sumarStock(detalle.detfFkProductos,detalle.detfCantidad).subscribe(producto=>{
      console.log(producto);
    });
  });
}
sumarStockInventario():void{
  this.compra.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
    this.compraService.sumarStockInventario(detalle.detfFkInventarios,detalle.detfCantidad).subscribe(inventario=>{
      console.log(inventario);
    });
  });
}

 /* ---- LISTA ALMACEN ---- */
 listarAlmacen(){
  this.almacenservice.listarAlmacen().subscribe(data=>{this.almacenes=data});
}

cargarAlmacen(event):void{
  this.almacen=event.value;
    console.log(this.almacen);
}

}


