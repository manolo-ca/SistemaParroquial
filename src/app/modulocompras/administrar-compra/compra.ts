import { Usuario } from 'src/app/login/login';
import { DetalleCompra } from './detalle-compra';
import { Proveedor } from './proveedor';
export class Compra{

    compId: number;
    compNumdocumento:string;
    compNumautorizacion:string;
    compFechaemision :string;
    compTotal:number;
    compEstado:string;
    compFkUsuario:Usuario
    compFkProveedor:Proveedor;
    
    //Variables que no pertenecen a la entidad

    docproveedor:string;
    proveedor:string;
    Monto:number;
    compTotalIva:number;
    compSubtotal:number;

    detalleCompraCollection:Array<DetalleCompra>=[];

    /* --- CALCULA EL TOTAL FINAL --- */
    calcularTotales():void{
        this.compTotal=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          if(detalle.producto.prodIva==true){
            this.compTotal+=detalle.calcularTotalProducto()+(detalle.producto.prodPrecio*detalle.detcCantidad)*0.12;
          }else{
            this.compTotal+=detalle.calcularTotalProducto();
           
          }
        });
      }
       /* --- CALCULA EL TOTAL INVENTARIO FINAL --- */
    calcularTotalesInventario():void{
      this.compTotal=0;
      this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
        this.compTotal+=detalle.calcularTotalInventario()+(detalle.inventario.invePrecio*detalle.detcCantidad)*0.12;
      });
    }
    
      /* --- CALCULA EL IVA FINAL --- */ 
  
      calcularIva():void{
        this.compTotalIva=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          if(detalle.producto.prodIva==true){
            this.compTotalIva+=(detalle.producto.prodPrecio*detalle.detcCantidad)*0.12;
          }else{
            this.compTotalIva+=0;
          }
          
        });
      }
       /* --- CALCULA EL IVA FINAL INVENTARIO --- */ 
  
       calcularIvaInventario():void{
        this.compTotalIva=0;
        this.detalleCompraCollection.forEach((detalle:DetalleCompra)=>{
          this.compTotalIva+=(detalle.inventario.invePrecio*detalle.detcCantidad)*0.12;
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
  