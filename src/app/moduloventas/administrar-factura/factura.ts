
import { Cliente } from 'src/app/modulofactura/cliente/cliente';
import { DetalleFactura } from './detalle-factura';


export class Factura {
    factId:number;
    factNumdocumento:string;
    factNumautorizacion:string="1124800540";
    factFechaemision:string;
    factTotal:number;
    factEstado:string='ACTIVO';
    detalleFacturaCollection:Array<DetalleFactura>=[];
    factFkCliente:Cliente;
    factTotalIva:number=0.00;
    factSubtotal:number=0.00;
    factSubtotalIva:number=0.00;
    factDescuentototal:number=0.00;
    factDescuentototalIva:number=0.00;
    /* Variables para las funciones del gestor de calculo */
    iva:number=0.00;
    subtotal:number=0.00;
  
    /* --- CALCULA EL TOTAL FINAL --- */
    calcularTotales():void{
      
      this.factTotal=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        if(detalle.producto.prodIva==true){
          this.factTotal+=detalle.calcularTotalProducto()-detalle.detfDescuento+(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
          this.factTotal=parseFloat(this.factTotal.toFixed(2));
        }else{
          this.factTotal+=detalle.calcularTotalProducto()-detalle.detfDescuento;
          this.factTotal=parseFloat(this.factTotal.toFixed(2));
        }
      });
    }
  
    /* --- CALCULA EL IVA FINAL --- */ 

    calcularIva():void{
      this.factTotalIva=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        if(detalle.producto.prodIva==true){
          this.factTotalIva+=(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
        }
      });
    }
  
    /* --- CALCULA EL SUBTOTAL FINAL --- */ 

    calcularSubTotal():void{
      this.factSubtotal=0;
      this.factSubtotalIva=0;
      this.iva=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        if(detalle.producto.prodIva==true){
         // this.iva+=(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
          this.factSubtotalIva+=detalle.calcularTotalProducto();//+this.iva;
        }else{
          this.factSubtotal+=detalle.calcularTotalProducto();
        }
       
      });
    }

    /* -------------------- CALCULAR EL SUBTOTAL DEL DESCUENTO DE LA FACTURA ------------------- */
    calcularDescuentoTotal():void{
      this.factDescuentototal=0;
      this.factDescuentototalIva=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        if(detalle.producto.prodIva==true){
         // this.iva+=(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
          this.factDescuentototalIva+=detalle.detfDescuento;//+this.iva;
        }else{
          this.factDescuentototal+=detalle.detfDescuento;
        }
       
      });
    }
}
