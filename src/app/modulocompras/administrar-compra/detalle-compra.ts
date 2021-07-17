import { Inventario } from './inventario';
import { Producto } from './producto';

export class DetalleCompra {
    detcId:number;
    detcCantidad:number=1;
    detcSubtotal:number=0.00;
    detcIva:number=0.00;
    detcAdicional:number=0.00;
    detcDescuento:number=0.00;
   dectFkArticulos:Producto;
    productoId:number=0.00;
    producto:Producto;
    inventario:Inventario;
    detcFkInventarios:number=0.00;


    /* --- CALCULA EL SUBTOTAL --- */
    public calcularTotalProducto(): number {
        return this.detcCantidad * this.producto.prodPrecio;
      }
      /* --- CALCULA EL SUBTOTAL --- */
    public calcularTotalInventario(): number {
      return this.detcCantidad * this.inventario.invePrecio;
    }
    /* --- CALCULA EL IVA FINAL --- */ 
  
    calcularIvaIndividual(cantidad:number): number {
      var conDecimal ; 
    
      var compTotalIva;
        if(this.producto.prodIva==true){
          compTotalIva=((this.producto.prodPrecio*cantidad)*0.12);
        }else{
          compTotalIva=0;
          
        }
        return conDecimal= compTotalIva.toFixed(2);
      
    }
    
   
   
     
}