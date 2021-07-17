
import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2'
import { Compra } from './compra';
import { CompraService } from './compra.service';
import { DetalleCompra } from './detalle-compra';
import { CajaMovimiento } from '../../modulofactura/caja/caja-movimiento'
import { CajaService } from '../../modulofactura/caja/caja.service'
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { FacturaService } from '../../moduloventas/administrar-factura/factura.service'
@Component({
  selector: 'app-administrar-compra',
  templateUrl: './administrar-compra.component.html',
})
export class AdministrarCompraComponent implements OnInit {
  compras: Compra[];
  private comprasTemp: Compra = new Compra();
  compra: Compra = new Compra();
  cajamovimiento: CajaMovimiento = new CajaMovimiento();
  persona: Persona = new Persona();

  subtotalcero: number = 0;
  subtotaliva: number = 0;
  totaliva: number = 0;
  totalivadescuento: number = 0;
  totalcerodescuento: number = 0;
  totaldescuento: number = 0;
  es: any;

  files: TreeNode[];
  addForm: FormGroup;
  dis: boolean;
  disa: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  showDialog() {
    this.disa = true;

  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private CompraServicio: CompraService,
    private nodeService: NodeService,
    private router: Router,
    private FacturaService: FacturaService,
    private formBuilder: FormBuilder,
    private cajaService: CajaService
  ) { }



  ngOnInit() {
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"],
      dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agt", "Sep", "Oct", "Nov", "Dec"],
      today: 'Hoy',
      clear: 'Borrar',
    };


    this.listar();

  }

  private listar(): void {
    this.CompraServicio.getCompras().subscribe(
      compras => this.compras = compras
    );
  }

  crearCompra() {
    this.router.navigateByUrl("sistemaparroquial/compras/ingreso");
  }

  delete(comp: Compra): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Anular Compra',
      text: `¡No podrás revertir esto! Anular la compra Num: ${comp.compNumdocumento}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        /*this.CompraServicio.getCompra(comp.compId).subscribe(
         ( data) =>{ this.comprasTemp = data ;*/
        this.comprasTemp = comp
    

      
        this.compra = comp;
        this.compra.compEstado = 'ANULADA';
        console.log(this.compra)

        this.CompraServicio.updateCompra(this.compra).subscribe((data) => {
          this.listar();
        });
        this.actualizarStock(comp);
        //this.generarCajaMovimiento(comp)
        this.FacturaService.getCajaMovimiento("COMPRA",comp.compId).subscribe((datamovimiento)=>{
          this.cajamovimiento=datamovimiento;
          this.cajamovimiento.cajmEstado='ANULADO';
          console.log(this.cajamovimiento);
          this.cajaService.updatecajaMovimiento(this.cajamovimiento).subscribe((data)=>{
            swal.fire(
              'Compra Anulada',
              `Factura ${comp.compNumdocumento} anulada con exito!`,
              'success'
            )
            this.listar();
          })
        })
   





        /*this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
          this.CompraServicio.deleteCompra(comp.compId).subscribe(
            response => {
              this.compras = this.compras.filter(servi => servi !== comp)
              swalWithBootstrapButtons.fire(
                'Eliminado!',
                `La compra  fue eliminada.`,
                'success'
              )
            })
        });*/
        // });

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La compra no se ha elimino :)',
          'error'
        )
      }
    })
  }



  /* FUNCION PARA VISUALIZAR LOS DATOS DE LA COMPRA PARA LA IMPRESION */
  cargarCompra(compra: Compra): void {

    this.reiniciarValores();  //reiniciar valores de los totales que cargan en la vista de la factura

    this.CompraServicio.getCompra(compra.compId).subscribe(data => {

      this.persona = data.compFkProveedor.provFkPersona;
      this.compra = data;

      this.compra.detalleCompraCollection.map((detalle: DetalleCompra) => {

        //Cargamos los datos del detalle de la compra
        if (detalle.dectFkArticulos.prodIva == true) {
          this.totaliva += detalle.detcIva;
          this.subtotaliva += detalle.detcSubtotal
          this.totalivadescuento += detalle.detcSubtotal - detalle.detcDescuento;
        } else {
          this.totalcerodescuento += detalle.detcSubtotal - detalle.detcDescuento;
          this.subtotalcero += detalle.detcSubtotal;
        }
        this.totaldescuento += detalle.detcDescuento;
      });

    });

    this.disa = true;
  }
  reiniciarValores() {
    this.totaliva = 0;
    this.subtotaliva = 0;
    this.totalivadescuento = 0;
    this.totalcerodescuento = 0;
    this.subtotalcero = 0;
    this.totaldescuento = 0;
  }

  public update(): void {
    this.disa = false;
    this.CompraServicio.updateCompra(this.compra)
      .subscribe(response => {
        swal.fire(
          'Compra Actualizada',
          `Compra ${this.compra.compId} actualizada con exito!`,
          'success'
        )
        this.listar();
      }
      )
  }

  /* ---------------------------  FUNCION PARA ACTUALIZAR EL STOCK DEL PRODUCTO EN INVENTARIO ------------------------- */
  actualizarStock(compraT: Compra): void {
    this.comprasTemp = compraT
    this.comprasTemp.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      this.CompraServicio.actualizarStock(detalle.dectFkArticulos.prodId, detalle.detcCantidad).subscribe(producto => { });
    });
  }
  generarCajaMovimiento2(compraT: Compra): void {
///no sirve
    console.log("entra")
    var idDoc = compraT.compNumautorizacion;
    this.cajamovimiento.cajmEstado = 'ACTIVO';
    this.cajamovimiento.cajmMonto = compraT.compTotal;
    this.cajamovimiento.cajmNumDoc = compraT.compNumdocumento;
    this.cajamovimiento.cajmIdDoc = compraT.compId
    this.cajamovimiento.cajmFecha = compraT.compFechaemision;
    this.cajamovimiento.cajmTipo = 'ANULACION';
    console.log(this.cajamovimiento);
    this.cajamovimiento.cajmFkCaja.cajaId = 4;
    console.log(this.cajamovimiento);
    /* this.cajaService.crearMovimientoCaja(this.cajamovimiento).subscribe(cajamovimiento => {
 
     })*/

  }
}