import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './proveedor';
import swal from 'sweetalert2';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import {jsPDF} from 'jspdf';
// import 'jspdf-autotable';

import autoTable, { applyPlugin } from 'jspdf-autotable';


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html'
})

export class ProveedorComponent implements OnInit {


  addForm1: FormGroup;
  addForm2: FormGroup;
  submitted = false;
  dis: boolean;
  dis_edit: boolean;
  cols: any[];
  tipo = {};

  proveedor: Proveedor = new Proveedor();
  proveedores: Proveedor[];
  persona: Persona = new Persona();
    personas: Persona[];

  showDialog() {
  /*  // this.proveedor.provFkPersona = new Persona();
    this.proveedor.persCedula = null;
    this.proveedor.provId = null;
    this.proveedor.provFkPersona.persApellido = null;
    this.proveedor.provFkPersona.persNombre = null;
    this.proveedor.provFkPersona.persEmail = null;
    this.proveedor.provFkPersona.persDireccion = null;
    this.proveedor.provFkPersona.persTelefono = null; */
    this.dis = true;
  }
  showDialogEdit(proveedor2:Proveedor):void {
    this.dis_edit = true;
    this.proveedor = proveedor2;
  }
  constructor( private personaService:PersonaService,private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder,private proveedorService:ProveedorService) { }

  ngOnInit() {

    this.cols = [
        { field: 'name', header: 'Cedula' },
        { field: 'size', header: 'Nombre' },
        { field: 'size', header: 'Apellido' },
        { field: 'size', header: 'Email' },
        { field: 'size', header: 'Teléfono' },
        { field: 'size', header: 'Dirección' }
    ];
    this.addForm1 = this.formBuilder.group({
      provFkPersona: ['', Validators.required],
      /* provCedula: ['', Validators.required],
      provNombre: ['', Validators.required],
      provApellido: ['', Validators.required],
      provCorreo: ['', Validators.required],
      provTelefono: ['', Validators.required],
      provDireccion: ['', Validators.required] */
    });
    this.addForm2 = this.formBuilder.group({
      provFkPersona: ['', Validators.required],
     /*  provCedula: ['', Validators.required],
      provNombre: ['', Validators.required],
      provApellido: ['', Validators.required],
      provCorreo: ['', Validators.required],
      provTelefono: ['', Validators.required],
      provDireccion: ['', Validators.required] */
    });

   this.listarProveedor();
   this.listarPersonas();
  }
  get f(){
    return this.addForm1.controls;
  }
  get f1(){
    return this.addForm2.controls;
  }


  listarProveedor():void{
    this.proveedorService.listarProveedor().subscribe((proveedores) => {this.proveedores = proveedores;
    });
  }
  listarPersonas():void {
    this.personaService.getPersonas().subscribe((personas) => {this.personas = personas;
      this.persona=personas[0];
    }); 
  }
 /*  crearProveedor():void {
    if (this.addForm1.invalid) {
      this.submitted = true;
      return;
    }
    this.proveedorService.crearProveedor(this.proveedor).subscribe(proveedor => {
      swal.fire('Proveedores','Proveedor creado con exito.','success')
    this.listarProveedor();
  })
  this.dis = false;
  } */
  crearProveedor():void {
    this.proveedor.provFkPersona = this.persona;
    if (this.addForm1.invalid) {
      this.submitted = true;
      return;
    }
    this.proveedorService.crearProveedor(this.proveedor).subscribe(proveedor => {
      swal.fire('Proveedores','Proveedor creado con exito.','success')
    this.listarProveedor();
    })
    this.dis = false;
  }
  editarProveedor():void {
    this.proveedor.provFkPersona = this.persona;
    if (this.addForm2.invalid) {
      this.submitted = true;
      return;
    }
    this.proveedorService.editarProveedor(this.proveedor).subscribe(proveedor => {
      swal.fire('Proveedor','Proveedor editado con exito.','success')
      this.listarProveedor();
    })
    this.dis_edit = false;
  }
  eliminarProveedor(proveedor: Proveedor): void {
    
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${proveedor.provFkPersona.persNombre + ' ' + proveedor.provFkPersona.persApellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminarProveedor(proveedor.provId).subscribe(
          response => {
            this.proveedores= this.proveedores.filter(servi => servi !== proveedor)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El proveedor fue eliminado.`,
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
          'El proveedor no se elimino :)',
          'error'
        )
      }
    })
  }

  
  exportPdf() {
    
    const prov = this.proveedores.map(inv => ({
      ced: inv.provFkPersona.persCedula, nombres: inv.provFkPersona.persNombre + ' ' + inv.provFkPersona.persApellido, 
      mail: inv.provFkPersona.persEmail, tlf: inv.provFkPersona.persTelefono, dir: inv.provFkPersona.persDireccion
    }));

    var columns = [
      {title: "Cédula", key: "ced"},
      {title: "Nombres", key: "nombres"},
      {title: "Email", key: "mail"},
      {title: "Teléfono", key: "tlf"},
      {title: "Dirección", key: "dir"}
    ];

    let pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('Listado de Proveedores', 11, 8);
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
    pdf.save('Proveedor.pdf');
    
}
}