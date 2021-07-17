import { Producto } from './producto';

export class DetalleFactura {
    dettfId:number;
    detfCantidad:number=1;
    detfSubtotal:number=0.00;
    detfIva:number=0.00;
    detfAdicional:number=0.00;
    detfDescuento:number=0.00;
    detfFkProductos:Producto;
    producto:Producto;
    detfPdescuento:number=0.00;
    /* --- CALCULA EL SUBTOTAL --- */
    public calcularTotalProducto(): number {
        return this.detfCantidad * this.producto.prodPrecio;
      }
}
