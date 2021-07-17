import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CapillaService } from './capilla.service';
import { Capilla } from './capilla';
import swal from 'sweetalert2';

import {jsPDF} from 'jspdf';
import 'jspdf-autotable';

import autoTable, { applyPlugin } from 'jspdf-autotable';
import { letterSpacing } from 'html2canvas/dist/types/css/property-descriptors/letter-spacing';

@Component({
  selector: 'app-capilla',
  templateUrl: './capilla.component.html', providers: [MessageService]
})

export class CapillaComponent implements OnInit {

  addForm1: FormGroup;
  addForm2: FormGroup;
  submitted = false;
  dis: boolean;
  dis_edit: boolean;
  cols: any[];
  tipo = {};

  capilla: Capilla = new Capilla();
  capillas: Capilla[];

  showDialog() {
    this.capilla.capiNombre = null;
    this.capilla.capiId = null;
    this.capilla.capiDetalle=null;
    this.dis = true;
  }

  showDialogEdit(capilla2:Capilla):void {
    this.dis_edit = true;
    this.capilla = {capiId: capilla2.capiId,
      capiNombre: capilla2.capiNombre,
      capiDetalle:capilla2.capiDetalle
    };
  }
  
  constructor(private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder, private capillaService:CapillaService
    , public messageService: MessageService) { }

  ngOnInit() {

    this.cols = [
        { field: 'size', header: 'Nombre' },
        { field: 'size', header: 'Detalle' }
    ];

    this.addForm1 = this.formBuilder.group({
      capiNombre: ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      capiDetalle:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]]
    });

    this.addForm2 = this.formBuilder.group({
      capiNombre: ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      capiDetalle:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]]
     
    });

    this.listarCapillas();

  }
  get f(){
    return this.addForm1.controls;
  }
  get f1(){
    return this.addForm2.controls;
  }

  listarCapillas():void {
    this.capillaService.listarCapilla().subscribe((capillas) => {this.capillas = capillas});
  }

  crearCapilla():void {
    if (this.addForm1.invalid) {
      this.submitted=true;
      return;
    }
    console.log(this.capilla);
    this.capilla.capiNombre = this.addForm1.controls.capiNombre.value;
    this.capillaService.crearCapilla(this.capilla).subscribe(capilla => {
      swal.fire('Capillas','Capilla creada con exito.','success')
      this.listarCapillas();
    })
    this.dis = false;
  }

  editarCapilla():void {
    if (this.addForm2.invalid) {
      this.submitted=true;
      return;
    }
    this.capillaService.editarCapilla(this.capilla).subscribe(capilla => {
      swal.fire('Capillas','Capilla editada con exito.','success')
      this.listarCapillas();
    })
    this.dis_edit = false;
  }

  eliminarCapilla(capilla: Capilla): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.capilla.capiNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.capillaService.eliminarCapilla(capilla.capiId).subscribe(
          response => {
            this.capillas = this.capillas.filter(servi => servi !== capilla)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `La capilla  fue eliminada.`,
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
          'La capilla no se elimino.',
          'error'
        )
      }
    })
  }
  exportPdf() {
    
     const capi = this.capillas.map(inv => ({
      nom: inv.capiNombre, deta: inv.capiDetalle
    }));

    var columns = [
      {title: "Nombre", key: "nom"},
      {title: "Detalle", key: "deta"},
      
      
    ];

    let pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('Listado de Capillas', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);


      
// (pdf as any).autoTable( columns, inven )
let cont = 0;
autoTable(pdf, {columns: columns, body: capi, didDrawCell: (HookData) => {
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
pdf.save('Capilla.pdf');

  }
}