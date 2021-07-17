
import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2'
import { Factura } from './factura';
import { FacturaService } from './factura.service';
import { GenerarFacturaComponent } from '../generar-factura/generar-factura.component';

import { Persona } from 'src/app/modulosp/registropersona/persona';
import { Cliente } from 'src/app/modulofactura/cliente/cliente';
import { Caja } from 'src/app/modulofactura/caja/caja';
import { CajaMovimiento } from 'src/app/modulofactura/caja/caja-movimiento';
import { Producto } from '../administrar-factura/producto';
import { Almacen } from 'src/app/modulobodega/almacen/almacen';
import { ProductoService } from 'src/app/modulobodega/productos/producto.service';
import { DetalleFactura } from './detalle-factura';
import { CompraService } from 'src/app/modulocompras/administrar-compra/compra.service';
import { CajaService } from 'src/app/modulofactura/caja/caja.service';


@Component({
  selector: 'app-administrar-factura',
  templateUrl: './administrar-factura.component.html',
})
export class AdministrarFacturaComponent implements OnInit {
  facturas: Factura[];
  private facturaobj: Factura = new Factura();

  /* -------- VARIABLES  -------- */
  titulo:string="Facturacion";
  validaboton:boolean=false;
  subtotaldetalle:number=0.00;
  subtotaldetalleiva:number=0.00;
  valordescuento:number=0.00;
  date3: Date;
  dis:boolean;
  dis2:boolean;
  es:any;
  sucursal:number=1;
  matriz:number=1;
  facturasecuencia:number=0;
  subtotalcero:number=0;
  subtotaliva:number=0;
  totaliva:number=0;
  totaldescuento:number=0;
  totalivadescuento:number=0;
  totalcerodescuento:number=0;
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


  files: TreeNode[];
  addForm: FormGroup;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  showDialog() {
    this.dis = true;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private FacturaServicio: FacturaService,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private genfactura: GenerarFacturaComponent,
    private productoservice:ProductoService,
    private compraService:CompraService,
    private cajaService: CajaService,
    
  ) { }



  ngOnInit() {

    this.addForm = this.formBuilder.group({
      
    });

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

    this.listar();

  }

  get f(){
    return this.addForm.controls;
  }

  private listar(): void {
    this.FacturaServicio.getFacturas().subscribe(
      facturas => this.facturas = facturas
    );
  }

  crearFactura(){
    this.router.navigateByUrl("sistemaparroquial/ventas/facturar");
  }

  delete(factura: Factura): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar la factura ${this.facturaobj.factId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.FacturaServicio.deleteFactura(factura.factId).subscribe(
          response => {
            this.facturas = this.facturas.filter(servi => servi !== factura)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `La factura  fue eliminada.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La factura no se ha elimino :)',
          'error'
        )
      }
    })
  }

  cancel(fact: Factura): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea anular?',
      text: `¡No podrás revertir esto! anular la factura ${fact.factNumdocumento}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Anular! ',
      cancelButtonText: ' No, Anular!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
     this.FacturaServicio.getFactura(fact.factId).subscribe((data)=>{ //Buscamos la factura por su id
          this.factura=data;
          this.factura.factEstado='ANULADA'; 
          this.FacturaServicio.updateFactura(this.factura).subscribe((data)=>{}); //Actualizamos el estado de la factura 
          this.factura.detalleFacturaCollection.forEach((detalle:DetalleFactura)=>{
          this.compraService.sumarStock(detalle.detfFkProductos.prodId,detalle.detfCantidad).subscribe((data)=>{});
          this.FacturaServicio.getCajaMovimiento("VENTA",fact.factId).subscribe((datamovimiento)=>{
            this.cajamovimiento=datamovimiento;
            this.cajamovimiento.cajmEstado='ANULADO';
            console.log(this.cajamovimiento);
            this.cajaService.updatecajaMovimiento(this.cajamovimiento).subscribe((data)=>{
              swal.fire(
                'Factura Anulada',
                `Factura ${fact.factNumdocumento} anulada con exito!`,
                'success'
              )
              this.listar();
            })
          })
          });
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Omitido',
          'La factura no se ha anulado',
          'error'
        )
      }
    })
  }

  /* FUNCION PARA VISUALIZAR LOS DATOS DE LA FACTURA PARA LA IMPRESION */
  cargarFactura(factura: Factura): void {

    this.reiniciarValores();  //reiniciar valores de los totales que cargan en la vista de la factura

    this.FacturaServicio.getFactura(factura.factId).subscribe(data => {
      
      this.persona=data.factFkCliente.clieFkPersona;
      this.factura=data;

      this.factura.detalleFacturaCollection.map((detalle:DetalleFactura)=>{
       
        //Cargamos los datos del detalle de la factura 
        if(detalle.detfFkProductos.prodIva==true){
          this.totaliva+=detalle.detfIva;
          this.subtotaliva+=detalle.detfSubtotal
          this.totalivadescuento+=detalle.detfSubtotal-detalle.detfDescuento;
        }else{
          this.totalcerodescuento+=detalle.detfSubtotal-detalle.detfDescuento;
          this.subtotalcero+=detalle.detfSubtotal;
        }
        this.totaldescuento+=detalle.detfDescuento;
      });

    });
    
    this.dis = true;
  }
  


  public update(): void {
    this.dis = false;
    this.FacturaServicio.updateFactura(this.facturaobj)
      .subscribe(response=> {
        swal.fire(
          'Factura Actualizada',
          `Factura ${this.facturaobj.factId} actualizada con exito!`,
          'success'
        )
        this.listar();
      }
      )
  }
  

  reiniciarValores(){
    this.totaliva=0;
    this.subtotaliva=0;
    this.totalivadescuento=0;
    this.totalcerodescuento=0;
    this.subtotalcero=0;
    this.totaldescuento=0;
  }

}

