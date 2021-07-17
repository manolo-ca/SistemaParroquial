import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/demo/service/carservice';
import { Car } from 'src/app/demo/domain/car';
import {  InventarioService } from './inventario.service';
import {  Inventario } from './inventario';
import swal from 'sweetalert2';
import { Activos } from '../activos/activos';
import { ActivosService } from '../activos/activos.service';
import { AlmacenService } from '../almacen/almacen.service';
import { Almacen } from '../almacen/almacen';

import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import autoTable, { applyPlugin } from 'jspdf-autotable';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html'
})

export class  InventarioComponent implements OnInit {

  files: TreeNode[];
  addForm1: FormGroup;
  addForm2: FormGroup;
  submitted = false;
  dis: boolean;
  submitted1 = false;
  
  inscripciones: any[];
  dis_edit: boolean;
  tipo = {};
  cars: Car[]

  almacen: Almacen = new Almacen();
  activo: Activos = new Activos();

  inventario: Inventario = new Inventario();
  inventarios: Inventario[];

  almacenes: Almacen[];
  activos: Activos[];

  showDialog() {
    this.inventario.inveNombre = null;
    this.inventario.inveId = null;
    this.inventario.invePrecio = null;
    this.inventario.inveDetalle= null;
    this.inventario.inveFkActivo =this.activos[0];
    this.inventario.inveCantidad= null;
    this.inventario.inveFkAlmacen = this.almacenes[0];
    this.dis = true;
  }
  showDialogEdit(inventario2:Inventario):void {
    this.dis_edit = true;
    this.inventario = {
      inveCantidad:inventario2.inveCantidad,
      inveDetalle: inventario2.inveDetalle, 
      inveId: inventario2.inveId,
      inveNombre: inventario2.inveNombre,
      invePrecio: inventario2.invePrecio,
      inveFkActivo: inventario2.inveFkActivo,
      inveFkAlmacen: inventario2.inveFkAlmacen
    };
  }
  
  
  constructor(private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder,
    private carService: CarService,private inventarioService:InventarioService, private almacenService:AlmacenService, private activosService:ActivosService) { }

  ngOnInit() {
    this.carService.getCarsMedium().then(cars => this.cars = cars);

    this.addForm1 = this.formBuilder.group({
      inveNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      inveCantidad:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      invePrecio:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      inveDetalle:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]]
    });
    this.addForm2 = this.formBuilder.group({
      inveNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      inveCantidad:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      invePrecio:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      inveDetalle:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]]
    });
    this.listarInventario();
    this.listarActivos();
    this.listarAlmacenes();
  }
  get f(){
    return this.addForm1.controls;
  }
  get f1(){
    return this.addForm2.controls;
  }
  
  listarAlmacenes():void {
    this.almacenService.listarAlmacen().subscribe((almacenes) => {
      this.almacenes = almacenes;
      this.inventario.inveFkAlmacen = almacenes[0];
    });
  }
  listarInventario():void{
    this. inventarioService.listarInventario().subscribe((inventarios) => {this.inventarios = inventarios});

  }

  listarActivos():void {
    this.activosService.listarActivo().subscribe((activos) => {this.activos = activos;
      this.inventario.inveFkActivo = activos[0];
    });
  }

  

  crearInventario():void {
    if (this.addForm1.invalid) {
      this.submitted = true;
      return;
    }
    this.inventarioService.crearInventario(this.inventario).subscribe(inventario => 
      {swal.fire('Inventarios','Inventario creado con exito.','success')
      this.listarInventario();
    })
    this.dis = false;
  }
  editarInventario():void {
    if (this.addForm2.invalid) {
      this.submitted = true;
      return;
    }
    this.inventarioService.editarInventario(this.inventario).subscribe(inventario => {
      swal.fire('Inventario','Inventario editado con exito.','success')
      this.listarInventario();
    })
    this.dis_edit = false;
  }
  eliminarInventario(inventario: Inventario): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.inventario.inveNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.eliminarInventario(inventario.inveId).subscribe(
          response => {
            this.inventarios = this.inventarios.filter(servi => servi !== inventario)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El inventario fue eliminado.`,
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
          'El inventario no se elimino :)',
          'error'
        )
      }
    })
  }

  cargarDatosAlmacen(event):void{
    this.almacen = event.value;
    this.inventario.inveFkAlmacen = this.almacen;
  }

  cargarDatosActivo(event):void{
    this.activo = event.value;
    this.inventario.inveFkActivo = this.activo;
  }

  exportPdf() {
    
    const inven = this.inventarios.map(inv => ({
      activo: inv.inveFkActivo.actiNombre, almacen: inv.inveFkAlmacen.almaNombre, nombre: inv.inveNombre, cantidad: inv.inveCantidad, precio: inv.invePrecio, detalle: inv.inveDetalle
    }));

    var columns = [
      {title: "Activo", key: "activo"},
      {title: "Almacén", key: "almacen"},
      {title: "Nombre", key: "nombre"},
      {title: "Cantidad", key: "cantidad"},
      {title: "Precio", key: "precio"},
      {title: "Detalle", key: "detalle"}
    ];

    let pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('Inventario', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    
// (pdf as any).autoTable( columns, inven )
let cont = 0;
autoTable(pdf, {columns: columns, body: inven, didDrawCell: (HookData) => {
  if (HookData.row.index > 0 && HookData.row.index % 10 === 0 && HookData.row ) {
    cont ++;
    if (cont === 3 ) {
      pdf.addPage();
      cont = 0;
    }
    
  }
}
})
// Open PDF document in browser's new tab
pdf.output('dataurlnewwindow')

// Download PDF doc  
pdf.save('inventario.pdf');



}

}