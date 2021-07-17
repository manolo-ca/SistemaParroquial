import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'
import { Tipodocumento } from '../tiposdocumentos/tipodocumento';
import { TipodocumentoService } from '../tiposdocumentos/tipodocumento.service';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';
import { Documento } from './documento';
import { DocumentoService } from './documento.service';
@Component({
  selector: 'app-documentopersonascrear',
  templateUrl: './documentopersonascrear.component.html'
})
export class DocumentopersonascrearComponent implements OnInit {

  documentospersonas: Documento[];
  private documentospersonas2: Documento = new Documento();
  private documentospersonas3: Documento = new Documento();
  tipodocumento: Tipodocumento[];

  tipDocumento : Tipodocumento = new Tipodocumento();
  banderaTipoDocumento : boolean = false;

  banderaCBautizo:boolean =false;
  banderaCMatrimonio :boolean=false;
  banderaCSolteria :boolean =false;

  personasejemplo: Persona[];
  private personasejemplo2: Persona = new Persona();

  files: TreeNode[];
  

  //** CREA FORMULARIOS REACTIVOS */ 
  addForm3: FormGroup = new FormGroup({
    docu_per: new FormControl('', [Validators.required]),
    docu_lib: new FormControl('', [Validators.required]),
    docu_refe: new FormControl('', [Validators.required]),
    docu_persona: new FormControl('', [Validators.required]),
    docu_doc: new FormControl('', [Validators.required]),
  });

  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  constructor(
    private documentoService: DocumentoService,
    private activatedRoute: ActivatedRoute,
    private personaService: PersonaService,
    private tipodocumentoService: TipodocumentoService,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  //********** CREA UN INTERFAZ A LA CLASE IMPLEMENTADA EN SUS FILES */
  ngOnInit(): void {

    this.nodeService.getFilesystem().then(files => this.files = files);
    this.cargarPersona();
    this.tipodocumentoService.getTiposDocumentos().subscribe(
      tipodocumento => this.tipodocumento = tipodocumento
    );
    this.cargarDocumentosPersona();
  }

  get f() { return this.addForm3.controls; }

  //*** CARGA LOS DATOS DE PERSONA */ 
  cargarPersona(): void {
    this.activatedRoute.params.subscribe(params => {
      let persId = params['persId']
      if (persId) {
        this.personaService.getPersona(persId).subscribe(
          (data) => this.personasejemplo2 = data)
      }
    })
  }
//********* CARGA LOS DOCUMENTOS CON PARAMETROS */
  cargarDocumentosPersona(): void {
    this.activatedRoute.params.subscribe(params => {
      let persid = params['persId']
      if (persid) {
        this.documentoService.getDocumentoPersona(+persid).subscribe(
          (data) => this.documentospersonas = data)
        console.log(this.documentospersonas)
      }
    })
  }
//********* CREA DOCUMETOS LOS CUALES DEBEN ESTAR COMPLETOS */
  public create(): void {
    if (
      this.personasejemplo2 == null ||
      this.documentospersonas2.docuLibronombre == null ||
      this.documentospersonas2.docuReferencia == null ||
      this.documentospersonas2.docuFkTipodocumento == null) {
      swal.fire(
        'Error al Guardar',
        'Revise los campos de entrada',
        'error'
      )
    } else {
      this.documentospersonas2.docuFkPersona = (this.personasejemplo2);
      console.log(this.documentospersonas2);
      this.documentoService.create(this.documentospersonas2).subscribe(
        json => {
         
          swal.fire(
            'Documento Guardado',
            `Documento ${this.documentospersonas2.docuFkTipodocumento.tipdNombre} creado con exito!`,
            'success'
          )
          this.cancelar();
          this.cargarDocumentosPersona();
        }
      )
    }
  }
 //********ELIMINA EL DOCUMENTO GENERADO */
  delete(documentospersonas: Documento): void {
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
        this.documentoService.delete(documentospersonas.docuId).subscribe(
          response => {
            this.documentospersonas = this.documentospersonas.filter(servi => servi !== documentospersonas)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El Documento fue eliminado.`,
              'success'
            )
          }
        )
      } else if (
     
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Su registro no se elimino :)',
          'error'
        )
      }
    })
  }
  cargarDocumento(documento: Documento): void {
    localStorage.setItem("docuId", documento.docuId.toString());
    let docuId = localStorage.getItem('docuId');
    this.documentoService.getDocumento(+docuId).subscribe((data) =>{
      this.documentospersonas2 = data;
      this.dis = true;
      this.banderaTipoDocumento=true;
      switch (this.documentospersonas2.docuFkTipodocumento.tipdNombre) {
        case "Certificado de Bautizo":
          this.banderaCBautizo=true;
          this.banderaCMatrimonio=false;
          this.banderaCSolteria=false;
        break;

        case "Certificado de Matrimonio":
          this.banderaCBautizo=false;
          this.banderaCMatrimonio=true;
          this.banderaCSolteria=false;
        break;

        case "Certificado de Soltería":
          this.banderaCBautizo=false;
          this.banderaCMatrimonio=false;
          this.banderaCSolteria=true;
        break;
      
        default:
          this.banderaCBautizo=true;
          this.banderaCMatrimonio=true;
          this.banderaCSolteria=true;
        break;
      }
      
    })
    
  }
//*********** ACTUALIZA LOS DOCUMENTOS (EDITAR) */
  public update(): void {
    this.dis = false;
    this.documentoService.update(this.documentospersonas2)
      .subscribe(tiposdocumentos => {
        swal.fire(
          'Documento Actualizado',
          `Documento ${this.documentospersonas2.docuFkTipodocumento.tipdNombre} actualizado con exito!`,
          'success'
        )
          this.cancelar();
        this.cargarDocumentosPersona();
      }
      )
  }
  public cancelar(): void {
      this.documentospersonas2=this.documentospersonas3
  }

  //*********COMPARACION DE TIPO DE DOCUMENTOS */
  CompararServicio(o1: Tipodocumento, o2: Tipodocumento): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.tipdId === o2.tipdId;
  }

  /*----------------------- FILTRO DE PRODUCTOS POR ALMACEN---------------------------------*/

  TipoDocumentoSeleccion(event):void{

    this.tipDocumento=event.value;
    if (this.tipDocumento  == null) {
      this.banderaTipoDocumento=false;
    }else{
      this.banderaTipoDocumento=true;
      switch (this.tipDocumento.tipdNombre) {
        case "Certificado de Bautizo":
          this.banderaCBautizo=true;
          this.banderaCMatrimonio=false;
          this.banderaCSolteria=false;
        break;

        case "Certificado de Matrimonio":
          this.banderaCBautizo=false;
          this.banderaCMatrimonio=true;
          this.banderaCSolteria=false;
        break;

        case "Certificado de Soltería":
          this.banderaCBautizo=false;
          this.banderaCMatrimonio=false;
          this.banderaCSolteria=true;
        break;
      
        default:
          this.banderaCBautizo=true;
          this.banderaCMatrimonio=true;
          this.banderaCSolteria=true;
        break;
      }
    }
  }
}
