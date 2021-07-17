import { Usuario } from 'src/app/login/login';
import { DetalleCompra } from './detalle-compra';
import { Proveedor } from './proveedor';
export class Compra{
  compNumdocumento:string;
    compNumautorizacion:string;
    docproveedor:string;
    proveedor:string;
    compFechaemision:string;
    Monto:number;
    compEstado:"ACTIVO";
    compFkProveedor:Proveedor;
    compTotal:number;
    detalleCompraCollection:Array<DetalleCompra>=[];
    compTotalIva:number;
    compSubtotal:number;


    /* --- CALCULA EL TOTAL FINAL --- */
    calcularTotales():void{
        this.compTotal=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          this.compTotal+=detalle.calcularTotalProducto()+(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
        });
      }
       /* --- CALCULA EL TOTAL INVENTARIO FINAL --- */
    calcularTotalesInventario():void{
      this.compTotal=0;
      this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
        this.compTotal+=detalle.calcularTotalInventario()+(detalle.inventario.invePrecio*detalle.detfCantidad)*0.12;
      });
    }
    
      /* --- CALCULA EL IVA FINAL --- */ 
  
      calcularIva():void{
        this.compTotalIva=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          this.compTotalIva+=(detalle.producto.prodPrecio*detalle.detfCantidad)*0.12;
        });
      }
       /* --- CALCULA EL IVA FINAL INVENTARIO --- */ 
  
       calcularIvaInventario():void{
        this.compTotalIva=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          this.compTotalIva+=(detalle.inventario.invePrecio*detalle.detfCantidad)*0.12;
        });
      }
    
      /* --- CALCULA EL SUBTOTAL FINAL --- */ 
  
      calcularSubTotal():void{
        this.compSubtotal=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          this.compSubtotal+=detalle.calcularTotalProducto();
        });
      }
       /* --- CALCULA EL SUBTOTAL FINAL --- */ 
  
       calcularSubTotalInventario():void{
        this.compSubtotal=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          this.compSubtotal+=detalle.calcularTotalInventario();
        });
      }
  }
  