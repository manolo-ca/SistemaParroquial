import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CarService } from 'src/app/demo/service/carservice';
import { Car } from 'src/app/demo/domain/car';
import { ActivosService } from './activos.service';
import { Activos } from './activos';
import swal from 'sweetalert2';

import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import autoTable, { applyPlugin } from 'jspdf-autotable';

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html'
})

export class ActivosComponent implements OnInit {

  files: TreeNode[];
  addForm1: FormGroup;
  addForm2: FormGroup;
  dis: boolean;
  dis_edit: boolean;
  submitted = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  cars: Car[]

  activo: Activos = new Activos();
  activos: Activos[];

  showDialog() {
    this.activo.actiNombre = null;
    this.activo.actiId = null;
  
    this.dis = true;
  }
  showDialogEdit(activo2:Activos):void {
    this.dis_edit = true;
    this.activo= {
      actiNombre: activo2.actiNombre,
      actiId: activo2.actiId
    };
  }
  constructor(private activatedRoute:ActivatedRoute,private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder,private carService: CarService,private activosService:ActivosService) { }

  ngOnInit() {
    this.carService.getCarsMedium().then(cars => this.cars = cars);

    this.cols = [
        { field: 'size', header: 'Nombre' },
    ];
    this.addForm1 = this.formBuilder.group({
      actiNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
    });
     this.addForm2 = this.formBuilder.group({
      actiNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
    });
    this.listarActivos();

  }

  
  get f(){
    return this.addForm1.controls;
  }
  get f1(){
    return this.addForm2.controls;
  }

  buscarActivos():void {

  }
  listarActivos():void {
    this.activosService.listarActivo().subscribe((activos) => {this.activos = activos});
  }




  crearActivo():void {
    if (this.addForm1.invalid) {
      this.submitted = true;
      return;
    }
    this.activosService.crearActivo(this.activo).subscribe(activo => 
      {swal.fire('Activos','Activo creado con exito.','success')
      this.listarActivos();
    })
    this.dis = false;
  }
  
 
  editarActivo():void {
    if (this.addForm2.invalid) {
      this.submitted = true;
      return;
    }
    this.activosService.editarActivo(this.activo).subscribe(activo => {
      swal.fire('Activos','Activo editado con exito.','success')
      this.listarActivos();
    })
    this.dis_edit = false;
  }

  
    eliminarActivo(activo: Activos): void {

      const swalWithBootstrapButtons = swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
  
      swalWithBootstrapButtons.fire({
        title: 'Esta seguro que desea eliminar?',
        text: `¡No podrás revertir esto! Eliminar`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Eliminar! ',
        cancelButtonText: ' No, Cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.activosService.eliminarCapilla(activo.actiId).subscribe(
            response => {
              this.activos = this.activos.filter(servi =>servi !== activo)
              swalWithBootstrapButtons.fire(
                'Eliminado',
                'Su activo fue eliminado',
                
              )
            }
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Su activo no se elimino :)',
            'error'
          )
        }
      })
    }
    exportPdf() {
    
      const prov = this.activos.map(inv => ({
        nom: inv.actiNombre
      }));
  
      var columns = [
        {title: "Nombre", key: "nom"}
      ];
  
      let pdf = new jsPDF();
  
      pdf.setFontSize(12);
      pdf.text('Listado de Activos', 11, 8);
      pdf.setFontSize(12);
      pdf.setTextColor(99);
  
  
      // (pdf as any).autoTable( columns, prov )
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
pdf.save('activos.pdf');
    }
  
    
    
}