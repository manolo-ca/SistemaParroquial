import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscripcionEucaristias } from './inscripcioneucaristias';
import { InscripcioneucaristiaService } from './inscripcioneucaristias.service';
import { QueryOptions } from 'src/app/spring-generic-mvc/model';
import swal from 'sweetalert2';
import { TipoEucaristiaService } from '../tipoeucaristias/tipoeucaristia.service';
import { TipoEucaristia } from '../tipoeucaristias/tipoeucaristia';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';



@Component({
  selector: 'app-inscripcioneucaristias',
  templateUrl: './inscripcioneucaristias.component.html'
})
export class InscripcioneucaristiasComponent implements OnInit {
 
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  addForm1: FormGroup;
  addForm: FormGroup =new FormGroup({
    reseOtros: new FormControl ('',[Validators.required]),
    reseDescripcion: new FormControl ('',[Validators.required]),
    reseValorfijo: new FormControl (''),
    reseFechareservacion: new FormControl (''),
    reseEstado: new FormControl (''),
    reseCalendario: new FormControl (''),
    reseTiposeucaristias: new FormControl ('',[Validators.required]),
    reseHora: new FormControl (''),
    resePersona: new FormControl (''),
    reseCedula: new FormControl ('')

  });

  ieucaristias = new Array<InscripcionEucaristias>();
  ieucaristia : InscripcionEucaristias = new InscripcionEucaristias();
  ieucaristia2 : InscripcionEucaristias;
  bandera = false;
  loading = true;
  totalrecords;
  numerofilas = 10;
  pagina = 0;
  botonDis: boolean;
  submitted: boolean;
  alerta :Boolean=false;

  tiposEucaristias : TipoEucaristia[];
  tipoEucaristiaSelect: TipoEucaristia = new TipoEucaristia();

  Estado : EstadoInterf[];
  estadoSelect: EstadoInterf;
  checked1: Boolean;
  Persona: Persona;
  PersonasLista : Persona[];

  fecInicio : Date = new Date;
  fecFin : Date = new Date;
  

  fechaReservacion : Date;
  ListaReporteEuca = new Array<InscripcionEucaristias>();
  dis2: Boolean;
  seleccionEucaristiaRe : string="";
  
  showDialog() {
    this.dis = true;
  }
  constructor(private nodeService: NodeService,
    private router: Router, 
    private formBuilder: FormBuilder, 
    private InscripcionEucaristiaServicio : InscripcioneucaristiaService, private TipoEucaristiaServicio: TipoEucaristiaService, private PersonaServicio : PersonaService) { }

  ngOnInit() {

    this.InscripcionEucaristiaServicio.getInscripcionesEucaristias().subscribe(data => {
      this.ieucaristias = data;
      this.totalrecords=this.ieucaristias.length;
    });
    this.TipoEucaristiaServicio.listarTipoEucaristiaPublico().subscribe(data => {
      this.tiposEucaristias = data;
    });
    this.addForm2 = this.formBuilder.group({
      tipe_descripcion: ['', Validators.required],
      tipe_nom: ['', Validators.required],
      tipe_doc: ['', Validators.required],
      tipe_estado: ['', Validators.required]
    });
    this.addForm1 = this.formBuilder.group({
      tipe_fecha_i: ['', Validators.required],
      tipe_fecha_f: ['', Validators.required],
      reseTiposeucaristias :['']
      
    });
    //*********   ESTADO DE LA INSCRIPCION */
    this.Estado = [
      {name: 'Activo', estado:true},
      {name: 'Inactivo', estado:false}
    ];
    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;

    });

    this.ieucaristia2= new InscripcionEucaristias();
  }
  displayModal: boolean;

  displayBasic: boolean;

  displayBasic2: boolean;

  displayPosition: boolean;

  position: string;

  showModalDialog() {
    this.addForm1.reset();
    this.fecInicio = new Date();
    this.fecFin = new Date();
    this.tipoEucaristiaSelect = new TipoEucaristia();
    this.displayModal = true;
  }

  showBasicDialog() {
      this.displayBasic = true;
  }
  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;  
  }
  columnFilter(event: any) {
  }

  disable(){
    this.dis=false;
    this.botonDis=false;
    this.addForm.reset();
  }
  onRowSelect(e) {

  }

  loadReservacionLazy(event: LazyLoadEvent) {
    this.loading = true;

  
    //imitate db connection over a network
    setTimeout(() => {
        if (this.ieucaristias) {
            this.ieucaristias = this.ieucaristias.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
  }

  loadCarsLazy(event) {
    this.loading = true;
    setTimeout(() => {
      if (this.ieucaristias) {
        const q: QueryOptions = new QueryOptions(); //El archivo para paginar los articulos realizado en spring tools
        q.pageSize = event.rows;
        //******* CALCULO DE LA PAGINA */
        let page = Math.ceil(event.first / this.numerofilas);
        this.pagina = page;
        if (page < 0) {
          page = 0;
        }
        q.pageNumber = page;
        
        q.sortField = event.sortField;
        q.sortOrder = event.sortOrder;
        if (event.filters.global) {
          this.InscripcionEucaristiaServicio.find(q, event.filters.global.value).subscribe(resp => {
            this.ieucaristias = resp.content;
            this.totalrecords = resp.totalElements*1;
          });
        } else {
          this.InscripcionEucaristiaServicio.list(q).subscribe(resp => {
            this.ieucaristias = resp.content;
            this.totalrecords = resp.totalElements*1;
          });
        }
        this.loading = false;
      }
    }, 1000);
  }

  listar(){
    this.InscripcionEucaristiaServicio.getInscripcionesEucaristias().subscribe(data => {
      this.ieucaristias = data;
      this.totalrecords=this.ieucaristias.length;
    });
  }

  crearNuevo(){
    this.router.navigateByUrl("serviciospastorales/usuario/eucaristia-inscripcion-usuario");
  }
//******* CARAGA LOS DATOS POR DEFECTO CON VALORES FIJOS DE RESERVACION */
  cargarDatos(){
    
    var Otros:string = this.addForm.get('reseOtros').value;
    var Descripcion:string = this.addForm.get('reseDescripcion').value;
    var valorFijo: number = this.addForm.get('reseValorfijo').value;


    this.Persona =  this.buscarCedula(this.addForm.get('reseCedula').value);
    this.tipoEucaristiaSelect = this.reseTiposeucaristias.value;

    this.ieucaristia2.inseOtros = Otros;
    this.ieucaristia2.inseDescripcionnombre = Descripcion;
    this.ieucaristia2.inseValorvoluntario=valorFijo;    
    this.ieucaristia2.inseFecharegistro=this.addForm.get('reseFechareservacion').value;   
    this.ieucaristia2.inseEstado=this.checked1;
    this.ieucaristia2.inseFkCalendario= this.ieucaristia2.inseFkCalendario;   
    this.ieucaristia2.inseFkPersona=this.Persona;   
    this.ieucaristia2.inseFkTiposeucaristias=this.tipoEucaristiaSelect;
  }
//******** BUSCA POR SU CEDULA */ */
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
    
  }
//****** CARGA LOS DATOS PARA EL REPORTE */
  cargarDatosReporte(){
    this.dis2 = true;
    this.ListaReporteEuca =[];
    this.seleccionEucaristiaRe="";
    if(this.tipoEucaristiaSelect.tipeNombre==null){
      this.seleccionEucaristiaRe="TODOS LOS REGISTROS"
      for (let index = 0; index < this.ieucaristias.length; index++){
        this.fechaReservacion =new Date (this.ieucaristias[index].inseFkCalendario.caleFecha);
        if((this.fechaReservacion.getTime() > this.fecInicio.getTime()) && (this.fechaReservacion.getTime() < this.fecFin.getTime())){
          this.ListaReporteEuca.push(this.ieucaristias[index]);
        }
      }
    }else{
      this.seleccionEucaristiaRe=this.tipoEucaristiaSelect.tipeNombre;
      for (let index = 0; index < this.ieucaristias.length; index++){
        this.fechaReservacion =new Date (this.ieucaristias[index].inseFkCalendario.caleFecha);
        if((this.fechaReservacion.getTime() > this.fecInicio.getTime()) && (this.fechaReservacion.getTime() < this.fecFin.getTime())){
          if(this.tipoEucaristiaSelect.tipeNombre==this.ieucaristias[index].inseFkTiposeucaristias.tipeNombre){
            this.ListaReporteEuca.push(this.ieucaristias[index]);
          }
        }
      }
    }
  }
//******* ACTUALIZA DATOS GENERADOS */
  ActualizarDatos(){
    if (this.addForm.invalid) {
      this.dis=false;
      console.log(this.ieucaristia2);
      swal.fire(
        'Error al Actualizar',
        `Existen campos erróneos`,
        "error")
      return;
    }else{
      this.ieucaristia2.inseEstado = this.checked1;
      this.InscripcionEucaristiaServicio.update(this.ieucaristia2).subscribe(data =>{
        this.listar();
        this.dis=false;
        swal.fire(
          'Actualizado Existosamente',
           `Se actualizo la inscripción correctamente`,
          "success")
        this.addForm.reset();
        this.listar();
      });
    }
    this.disable();
  }
//******* ELIMINA LOS TIPOS CREADOS */
  EliminarTipo(inscEuca: InscripcionEucaristias) {
    swal.fire({
      title: 'Eliminar Inscripción de Eucaristía?',
      text: `¿Desea Eliminar la Inscripción ${inscEuca.inseDescripcionnombre} ?`,
      showDenyButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.InscripcionEucaristiaServicio.delete(inscEuca.inseId).subscribe(
          response => {
            this.ieucaristias = this.ieucaristias.filter(servi => servi !== inscEuca)
          }
        )
        swal.fire('Inscripción Eliminada!', '', 'success')
        this.listar();
      } else if (result.isDenied) {
      }
    })
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('Inicio', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
//********* CARGA LOS TIPOS DE EUCARISTIAS GENERADAS */
  cargarTiposEucarista(inscEuca: InscripcionEucaristias): void {
    this.addForm.reset();
    localStorage.setItem("tipeId", inscEuca.inseId.toString());
    let tipeId = localStorage.getItem('tipeId');
    this.InscripcionEucaristiaServicio.getInscripcionEucaristia(+tipeId).subscribe(data =>{
      this.ieucaristia2 = data
      this.checked1 = this.ieucaristia2.inseEstado;
      this.reseHora.setValue(this.ieucaristia2.inseFkCalendario.caleFecha+"");
      this.reseCedula.setValue(this.ieucaristia2.inseFkPersona.persCedula+"");
      this.resePersona.setValue(this.ieucaristia2.inseFkPersona.persNombre+" "+this.ieucaristia2.inseFkPersona.persApellido);
      this.dis = true;
      console.log(this.ieucaristia2);
      this.listar();
    });
    
  }
  get reseOtros(){return this.addForm.get('reseOtros');}
  get reseDescripcion(){return this.addForm.get('reseDescripcion');}
  get reseValorfijo(){return this.addForm.get('reseValorfijo');}
  get reseFechareservacion(){return this.addForm.get('reseFechareservacion');}
  get reseEstado(){return this.addForm.get('reseEstado');}
  get reseCalendario(){return this.addForm.get('reseCalendario');}
  get resePersona(){return this.addForm.get('resePersona');}
  get reseTiposeucaristias(){return this.addForm.get('reseTiposeucaristias');}
  get reseHora(){return this.addForm.get('reseHora');}
  get reseCedula(){return this.addForm.get('reseCedula');}

  handleChange(e) {
    this.checked1 = e.checked;
  
  }

}
interface EstadoInterf {
  name: string;
  estado: boolean;
}
