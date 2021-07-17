import { Inventario } from './inventario';
import { Producto } from './producto';

export class DetalleCompra {
    dettfId:number;
    dettExistencias:number;
    detfCantidad:number=1;
    detfSubtotal:number=0.00;
    detfIva:number=0.00;
    detfAdicional:number=0.00;
    detfDescuento:number=0.00;
    detfFkProductos:number=0.00;
    producto:Producto;
    inventario:Inventario;
    detfFkInventarios:number=0.00;
    /* --- CALCULA EL SUBTOTAL --- */
    public calcularTotalProducto(): number {
        return this.detfCantidad * this.producto.prodPrecio;
      }
      /* --- CALCULA EL SUBTOTAL --- */
    public calcularTotalInventario(): number {
      return this.detfCantidad * this.inventario.invePrecio;
    }
   
}