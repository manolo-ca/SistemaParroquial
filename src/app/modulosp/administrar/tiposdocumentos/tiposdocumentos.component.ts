import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Servicio } from '../servicioslista/servicio';
import { ServicioService } from '../servicioslista/servicio.service';
import { Tipodocumento } from './tipodocumento';
import { TipodocumentoService } from './tipodocumento.service';
import swal from 'sweetalert2'
@Component({
  selector: 'app-tiposdocumentos',
  templateUrl: './tiposdocumentos.component.html'
})
export class TiposdocumentosComponent implements OnInit {
  tipodocumento: Tipodocumento[];
  private tipodocumento2: Tipodocumento = new Tipodocumento();
  servicios: Servicio[];


  files: TreeNode[];
  addForm3: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  showDialog() {
    this.tipodocumento2.tipdId = null;
    this.tipodocumento2.tipdNombre = null;
    this.tipodocumento2.tipdDescripcion = null;
    this.tipodocumento2.tipdValor = null;
    this.dis = true;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private tipodocumentoService: TipodocumentoService,
    private servicioService: ServicioService,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }



  ngOnInit() {
    this.nodeService.getFilesystem().then(files => this.files = files);
    this.listar();
    this.servicioService.getServicios().subscribe(
      servicios => this.servicios = servicios
    );
  }
//********* LISTA LOS TIPOS DE DOCUMENTOS  */
  private listar(): void {
    this.tipodocumentoService.getTiposDocumentos().subscribe(
      tipodocumento => this.tipodocumento = tipodocumento
    );
  }
//********* SE CREA LOS TIPOS Y VERIFICA QUE NO EXISTA CAMPOS VACION NI ERRORES */
  public create(): void {
    if (
      this.tipodocumento2.tipdNombre == null ||
      this.tipodocumento2.tipdValor ==null ||
      this.tipodocumento2.tipdDescripcion ==null||
      this.tipodocumento2.tipdFkServicio==null) {
      this.dis = false;
      swal.fire(
        'Error al Guardar',
        'Revise los datos de entrada',
        'error'
      )
    } else {
      this.dis = false;
      this.tipodocumentoService.create(this.tipodocumento2).subscribe(
        Response => {
          swal.fire(
            'Documento Guardado',
            `Documento ${this.tipodocumento2.tipdNombre} creado con exito!`,
            'success'
          )
          this.listar();
        }
      )
    }
  }
//******** ELIMINA EL TIPO DE DOCUMENTO INGRESADO */
  delete(tipodocumento: Tipodocumento): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.tipodocumento2.tipdNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipodocumentoService.delete(tipodocumento.tipdId).subscribe(
          response => {
            this.tipodocumento = this.tipodocumento.filter(servi => servi !== tipodocumento)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Su Documento  fue eliminado.`,
              'success'
            )
          }
        )
      } else if (
        
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Su Documento no se elimino :)',
          'error'
        )
      }
    })
  }
//********  CARGA TODOS LOS TIPOS INGRESADOS*/
  cargarTiposDocumentos(tipoDocumento: Tipodocumento): void {
    localStorage.setItem("tipdId", tipoDocumento.tipdId.toString());
    let tipdId = localStorage.getItem('tipdId');
    this.tipodocumentoService.getTipoDocumento(+tipdId).subscribe((data) =>
      this.tipodocumento2 = data);
    this.dis = true;
  }
//********* EDITA EL TIPO DE DOCUMENTO INGRESADO */
  public update(): void {
    this.dis = false;
    this.tipodocumentoService.update(this.tipodocumento2)
      .subscribe(tiposdocumentos => {
        swal.fire(
          'Documento Actualizado',
          `Documento ${this.tipodocumento2.tipdNombre} actualizado con exito!`,
          'success'
        )
        this.listar();
      }
      )
  }
//******  COMPARA LOS SERCICOS NO DEBEN SER REPETIDOS */
  CompararServicio(o1: Servicio, o2: Servicio): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.servId === o2.servId;
  }
}