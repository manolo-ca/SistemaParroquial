import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emisiondocumento, Estado, FechaBusqueda } from './emisiondocumento';
import { EmisiondocumentoService } from './emisiondocumento.service';
import swal from 'sweetalert2';
import { Persona } from '../../registropersona/persona';
import { Tipodocumento } from '../tiposdocumentos/tipodocumento';
import { PersonaService } from '../../registropersona/persona.service';
import { TipodocumentoService } from '../tiposdocumentos/tipodocumento.service';
import { Documento,Documentodos } from '../documentopersonascrear/documento';
import { DocumentoService } from '../documentopersonascrear/documento.service';

import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ScrollPanelModule } from 'primeng/scrollpanel';
@Component({
  selector: 'app-emiciondocumentos',
  templateUrl: './emiciondocumentos.component.html'
})
export class EmiciondocumentosComponent implements OnInit {
  emiciondocumentos: Emisiondocumento[];
  emiciondocumentosFecha: Emisiondocumento[];
  private emiciondocumentos2: Emisiondocumento = new Emisiondocumento();
  private fechaBusqueda: FechaBusqueda = new FechaBusqueda();
  private persona: Persona = new Persona();
  private documento2:Documento=new Documento();
  tipodocumento2: Tipodocumento[];
  private listaDocumento: Documento[];

  private listaDocumentodos:Documentodos=new Documentodos;
  private tipodocumento: Tipodocumento = new Tipodocumento();
  estado: Estado[] = [
    { id: 1, name: 'Pendiente', code: 'Pendiente' },
    { id: 2, name: 'Aprobado', code: 'Aprobado' },
    { id: 3, name: 'Cancelado', code: 'Cancelado' }
  ];
  addForm: FormGroup = new FormGroup({
    reseOtros: new FormControl('', [Validators.required]),
    reseDescripcion: new FormControl('', [Validators.required]),
    reseValorfijo: new FormControl('', [Validators.required]),
    reseFechareservacion: new FormControl('', [Validators.required]),
    reseEstado: new FormControl(''),
    reseCalendario: new FormControl('', [Validators.required]),
    reseTiposeucaristias: new FormControl('', [Validators.required]),
    reseHora: new FormControl('', [Validators.required]),
    resePersona: new FormControl('', [Validators.required]),
    reseCedula: new FormControl('', [Validators.required])

  });
  files: TreeNode[];
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  addForm1: FormGroup;
  dis2: Boolean;


  showDialog() {
    this.dis = true;
  }
  constructor(
    private nodeService: NodeService,
    private tipodocumentoService: TipodocumentoService,
    private router: Router,
    private documentoService:DocumentoService,
    private formBuilder: FormBuilder,
    private emisiondocumentoService: EmisiondocumentoService,
    private personaService: PersonaService,
  ) { }




  ngOnInit() {

    this.nodeService.getFilesystem().then(files => this.files = files);
    this.listar();
   
      
  }
  private listar(): void {
    this.emisiondocumentoService.getEmisionesDocumentos().subscribe(
      emiciondocumentos => this.emiciondocumentos = emiciondocumentos
    );
  }
  private listarFecha(): void {
    var fechainicio = this.fechaBusqueda.fechaInicio;
    var fechafin = this.fechaBusqueda.fechaFin;
    var documento = this.fechaBusqueda.idDocumentos;
    console.log(documento)

 //******* VALIDACION DE CAMPOS VACIOS */
    if (fechainicio == null || fechafin == null) {
      this.displayModal = false;
      swal.fire('Campos vacios', 'Debe llenar los campos con datos correctos', 'error');
    } else {
      console.log(fechainicio)
      console.log(fechafin)
      if(documento==null){
        this.emisiondocumentoService.getEmisionDocumentoFechaDocumentos(fechainicio, fechafin).subscribe(
          data => this.emiciondocumentosFecha = data
        );
      }else{
        this.emisiondocumentoService.getEmisionDocumentoFechaDocumentosTipo(fechainicio, fechafin,documento).subscribe(
          data => this.emiciondocumentosFecha = data
        );
      }

     
    }


  }
  displayModal: boolean;

  displayBasic: boolean;

  displayBasic2: boolean;

  displayPosition: boolean;

  displayModalmatrimonio: boolean;
  displayModalbautizmo: boolean;
  displayModalCersolteria: boolean;

  position: string;

  showModalDialog() {
    this.tipodocumentoService.getTiposDocumentos().subscribe(
      tipodocumento => this.tipodocumento2 = tipodocumento
    );
    this.displayModal = true;
  }
  showBasicDialogmatrimonio() {
    this.displayModalmatrimonio = true;
    this.displayBasic=false;
    
  }
  showBasicDialogsolteria() {
    this.displayModalCersolteria = true;
    this.displayBasic=false;
    
  }
  showBasicDialogbautizmon() {
    this.displayModalbautizmo = true;
    this.displayBasic=false;
   
  }
  showBasicDialog() {
    this.displayBasic = true;
  }
  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }
  cargardatosDocumento():void {
    this.update();
    console.log(this.documento2);
    var idpersona = this.persona.persid;
    this.displayBasic = false;
    var iddocumento = this.listaDocumentodos.id;
    console.log(iddocumento);
    console.log(this.tipodocumento.tipdId);

    if (iddocumento==this.tipodocumento.tipdId && iddocumento != null && idpersona != null) {
      
      this.documentoService.getDocumentoPlantilla(iddocumento,idpersona).subscribe(data =>{
        this.documento2 = data
        console.log(this.documento2);
       
        this.showBasicDialogbautizmon();  
      });
      
    } else {

      swal.fire('Error al Buscar ',
        'No se encuentra los campos requeridos, o los documentos no coinciden',
        'error')
        

    }
  }
  //********CARGA LOS DOCUMENTOS CON PLANTILLAS */
  cargardatosDocumento1():void {
    console.log(this.documento2);
    this.update();
    var idpersona = this.persona.persid;
    this.displayBasic = false;
    var iddocumento = this.listaDocumentodos.id;
    console.log(iddocumento);
    console.log(this.tipodocumento.tipdId);
    if (iddocumento==this.tipodocumento.tipdId && iddocumento != null && idpersona != null) {
      this.documentoService.getDocumentoPlantilla(iddocumento,idpersona).subscribe(data =>{
        this.documento2 = data
        console.log(this.documento2);
        
        this.showBasicDialogmatrimonio(); 
      });
       
    } else {
      
      swal.fire('Error al buscar ',
        'no se encuentra los campos requeridos, o los documentos no coinciden',
        'error')
        
    }
  }
  //******** CARGA LOS DOCUMENTOS CON PLANTILLA */
  cargardatosDocumento2():void {
    console.log(this.documento2);
    this.update();
    var idpersona = this.persona.persid;
    var iddocumento = this.listaDocumentodos.id;
    console.log(iddocumento);
    console.log(this.tipodocumento.tipdId);
    this.displayBasic = false;
    if (iddocumento==this.tipodocumento.tipdId && iddocumento != null && idpersona != null) {
      this.documentoService.getDocumentoPlantilla(iddocumento,idpersona).subscribe(data =>{
        this.documento2 = data
        console.log(this.documento2);
        
        this.showBasicDialogsolteria(); 
      });
       
    } else {
     
     
      swal.fire('Error al buscar ',
        'no se encuentra los campos requeridos, o los documentos no coinciden',
        'error')
        
    }
  }

  cargarSolicitudDocumentos(emisiondocumento: Emisiondocumento): void {
    localStorage.setItem("servId", emisiondocumento.emidId.toString());
    let servId = localStorage.getItem('servId');
    var id=emisiondocumento.emidFkPersona.persid;
    this.cargarListaDocumentosPersona(id);
    this.emisiondocumentoService.getEmisionDocumento(servId).subscribe(data =>
      this.emiciondocumentos2 = data)
    this.persona = emisiondocumento.emidFkPersona;
    this.tipodocumento = emisiondocumento.emidFkTipodocumento;
    this.displayBasic = true;
  }
  cargarListaDocumentosPersona(id:number):void{
  
   this.documentoService.getDocumentoPersona(id).subscribe(data=>this.listaDocumento=data);
    
  }

  //**********ACTUALIZA LOS DATOS DEL DOCUMENTO GENERADO
  public update(): void {
    this.dis = false;
    this.displayBasic = false;
    this.emisiondocumentoService.update(this.emiciondocumentos2)
      .subscribe(tiposdocumentos => {
        swal.fire(
          'Documento Actualizado',
          `Documento ${this.emiciondocumentos2.emidDescripcion} actualizado con exito!`,
          'success'
        )
        this.listar();
        
        //window.location.reload();
      }
      )
  }

  //******* ELIMINAR LA SOLICITUD DEL DOCUMENTO */
  delete(emisiondocumento: Emisiondocumento): void {
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
        this.emisiondocumentoService.delete(emisiondocumento.emidId).subscribe(
          response => {
            this.emiciondocumentos = this.emiciondocumentos.filter(servi => servi !== emisiondocumento)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `La solicitud del documento fue eliminado.`,
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
  //********CARGA LOS DATOS PARA EL REPORTE
  cargarDatosReporte() {
    this.dis2 = true;
  }
  CompararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.code === o2.code;
  }


  generatePdf() {
    if (this.emiciondocumentosFecha == null) {
      this.displayModal = false;
      swal.fire('Error sl cargar', 'Debe primero previzualizar el documento', 'error');
    } else {
      var header = [[
        "Cedula",
        "Nombre de la persona",
        "Referencia",
        "Descripcion",
        "Fecha solicitud",
        "Tipo Documento",
        "Estado"
      ]];
      var tableData = [];
      var itemNew = this.emiciondocumentosFecha;

      itemNew.forEach(element => {
        var temp = [
          [element.emidFkPersona.persCedula],
          [element.emidFkPersona.persNombre],
          [element.emidReferencias],
          [element.emidDescripcion],
          [element.emidFechasolicitud],
          [element.emidFkTipodocumento.tipdNombre],
          [element.emidEstado]
        ];
        tableData.push(temp);
      });
      var fechainicio = this.fechaBusqueda.fechaInicio;
      var fechafin = this.fechaBusqueda.fechaFin;
      const doc = new jspdf.jsPDF();
      doc.setFontSize(20);//
      doc.text("PARROQUIA SAN JOAQUIN", 10, 10);
      doc.setFontSize(13);//
      doc.text("Reporte de Emision de Documentos", 10, 20);
      doc.text("Fecha de Inicio: " + fechainicio, 10, 30);
      doc.text("Fecha de Fin: " + fechafin, 10, 40);
      doc.setFontSize(15);//
      var logo = new Image();
      logo.src = '../../../assets/layout/images/sanjoaquin.jpg';
      /*
      La variable que contiene la imagen.
      El tipo de la imagen, también podría ser 'PNG'.
      La posición inicial en x.
      La posición inicial en y.
      El ancho que tendrá la imagen.
      El alto que tendrá la imagen.
      */
      doc.addImage(logo, 'JPEG', 170, 0, 35, 40);

      (doc as any).autoTable({
        startY: 45,
        head: header,
        body: tableData,
        theme: 'grid',
        didDrawCell: data => {
          console.log(data.column.index)
        }
      })

     
      doc.save('ReporteEmisionDocumentos.pdf');
    }
  }

  //*********CAPTURA DE DATOS PARA GENERAR EL PDF
  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf.jsPDF('p', 'mm', 'a4'); 
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
     
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }
  //******** COMPARA LOS DOCUEMENTOS(TIPOS) */
  CompararDocumento(o1: Tipodocumento, o2: Tipodocumento): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
  }
  Comparartipo(o1: Documento, o2: Documento): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
  }
}
