import { Component, OnInit } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlmacenService } from './almacen.service';
import { Almacen } from './almacen';
import swal from 'sweetalert2';
import { Capilla } from '../capillas/capilla';
import { CapillaService } from '../capillas/capilla.service';

import {jsPDF} from 'jspdf';

import autoTable, { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF)

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html'
})


export class AlmacenComponent implements OnInit {

  submitted = false;
  addForm1: FormGroup;
  addForm2: FormGroup;
  dis: boolean;
  dis_edit: boolean;
  cols: any[];
  tipo = {};

  almacen: Almacen = new Almacen();
  almacenes: Almacen[];

  capilla: Capilla = new Capilla();
  capillas: Capilla[];

  showDialog() {
    this.almacen.almaId = null;
    this.almacen.almaNombre = null;
    this.almacen.almaVenta = false;
    this.dis = true;
  }

  showDialogEdit(almacen2:Almacen):void {
    this.dis_edit = true;
    this.almacen = {almaFkCapilla: almacen2.almaFkCapilla,
      almaId: almacen2.almaId, almaNombre: almacen2.almaNombre,
      almaVenta: almacen2.almaVenta
    };
  }
 
  
  constructor(private nodeService: NodeService,private router: Router,
    private formBuilder: FormBuilder,private almacenService:AlmacenService, private capillaService:CapillaService) {
    
  }

  ngOnInit() {
    this.cols = [
        { field: 'name', header: 'Capilla' },
        { field: 'size', header: 'Nombre' },
        { field: 'boolean', header: 'Venta' }
    ];

    this.addForm1 = this.formBuilder.group({
      almaFkCapilla: ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      almaNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      almaVenta:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]]
    });

    this.addForm2 = this.formBuilder.group({
      almaFkCapilla:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      almaNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      almaVenta:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]]
    });

    this.listarAlmacenes();
    this.listarCapillas();
  }

  get f(){
    return this.addForm1.controls;
  }
  get f1(){
    return this.addForm2.controls;
  }

  listarCapillas():void {
    this.capillaService.listarCapilla().subscribe((capillas) => {this.capillas = capillas;
      this.capilla = capillas[0];
    });
  }

  listarAlmacenes():void {
    this.almacenService.listarAlmacen().subscribe((almacenes) => {
      this.almacenes = almacenes;
      
    });
  }

  crearAlmacen():void {
    this.almacen.almaFkCapilla = this.capilla;
    if (this.almacen.almaVenta === null) {
      this.almacen.almaVenta = false;
    }
    console.log(this.almacen);
    if (this.addForm1.invalid) {
      this.submitted = true;
      return;
    }
    this.almacenService.crearAlmacen(this.almacen).subscribe(almacen => {
      swal.fire('Almacenes','Almacen creado con exito.','success')
      this.listarAlmacenes();
    })
    this.dis = false;
  }
  cargarDatosCapilla(event):void{
    this.capilla = event.value;
    this.almacen.almaFkCapilla = this.capilla;
  }
  editarAlmacen():void {
    this.almacen.almaFkCapilla = this.capilla;
    if (this.addForm2.invalid) {
      this.submitted = true;
      return;
    }
    this.almacenService.editarAlmacen(this.almacen).subscribe(almacen => {
      swal.fire('Almacenes','Almacen editado con exito.','success')
      this.listarAlmacenes();
    })
    this.dis_edit = false;
  }

  eliminarAlmacen(almacen: Almacen): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.almacen.almaNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.almacenService.eliminarAlmacen(almacen.almaId).subscribe(
          response => {
            this.almacenes = this.almacenes.filter(servi => servi !== almacen)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El almacen  fue eliminada.`,
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
          'El almacen no se elimino.',
          'error'
        )
      }
    })
  }

  CompararServicio(o1: Capilla, o2: Capilla): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.capiId === o2.capiId;
  }

  exportPdf() {
    
    const prov = this.almacenes.map(inv => ({
      nom: inv.almaNombre, venta: this.almacenVenta(inv.almaVenta), cap: inv.almaFkCapilla.capiNombre
    }));

    var columns = [
      {title: "Nombre", key: "nom"},
      {title: "Venta", key: "venta"},
      {title: "Capilla", key: "cap"}
      
    ];

    let pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('Listado de Almacenes', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);
    let cont = 0;
    autoTable(pdf, {columns: columns, body: prov, didDrawCell: (HookData) => {
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
    // pdf.save('inventario.pdf');  
  }
  almacenVenta(iva: Boolean): string 
    {if (iva) {
      return 'Venta';
    }else{
      return 'N/A';

    }
  }

}