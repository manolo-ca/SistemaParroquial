import { Cliente } from '../cliente/cliente';
import { DetalleFactura } from './detalle-factura';


export class Factura {
    factId:number;
    factNumdocumento:string;
    factNumautorizacion:string;
    factFechaemision:string;
    factTotal:number;
    factEstado:string='ACTIVO';
    detalleFacturaCollection:Array<DetalleFactura>=[];
    factFkCliente:Cliente;
    factTotalIva:number;
    factSubtotal:number;
  
    /* --- CALCULA EL TOTAL FINAL --- */
    calcularTotales():void{
      this.factTotal=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        this.factTotal+=detalle.calcularTotalProducto()+(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
      });
    }
  
    /* --- CALCULA EL IVA FINAL --- */ 

    calcularIva():void{
      this.factTotalIva=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        this.factTotalIva+=(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
      });
    }
  
    /* --- CALCULA EL SUBTOTAL FINAL --- */ 

    calcularSubTotal():void{
      this.factSubtotal=0;
      this.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
        this.factSubtotal+=detalle.calcularTotalProducto();
      });
    }
}
