import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservacionEucaristia } from './reservacioneucaristia';
import { ReservacionEucaristiaService } from './reservacioneucaristia.service';
import { QueryOptions } from 'src/app/spring-generic-mvc/model';
import { TipoEucaristiaService } from '../tipoeucaristias/tipoeucaristia.service';
import { TipoEucaristia } from '../tipoeucaristias/tipoeucaristia';
import Swal from 'sweetalert2';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';
@Component({
  selector: 'app-reservacioneucaristias',
  templateUrl: './reservacioneucaristias.component.html'
})
export class ReservacioneucaristiasComponent implements OnInit {
 
  addForm2: FormGroup;
  dis: boolean;
  dis2: boolean;
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

  reucaristias = new Array<ReservacionEucaristia>();
  

  reucaristia : ReservacionEucaristia = new ReservacionEucaristia();
  reucaristia2 : ReservacionEucaristia;
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
  ListaReporteEuca = new Array<ReservacionEucaristia>();
  seleccionEucaristiaRe : string="";
  
  showDialog() {
    this.dis = true;
  }
  constructor(private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder, private ReservacionEucaristiaServicio : ReservacionEucaristiaService, private TipoEucaristiaServicio: TipoEucaristiaService, private PersonaServicio : PersonaService) { }

  ngOnInit() {
    this.fecInicio.getFullYear();
    this.fecInicio.getMonth();
    this.fecInicio.getDate();
    this.ReservacionEucaristiaServicio.getReservacionesEucaristias().subscribe(data => {
      this.reucaristias = data;
      this.totalrecords=this.reucaristias.length;
    });
    this.TipoEucaristiaServicio.listarTipoEucaristiaPrivado().subscribe(data => {
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
      tipe_documento: ['', Validators.required],
      reseTiposeucaristias :['']
      
    });
    //****** EVENTO DE ESTADO ACTIVO O INACTIVO */
    this.Estado = [
      {name: 'Activo', estado:true},
      {name: 'Inactivo', estado:false}
    ];
    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;

    });

    this.reucaristia2= new ReservacionEucaristia();
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

    setTimeout(() => {
        if (this.reucaristias) {
            this.reucaristias = this.reucaristias.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
  }

  loadCarsLazy(event) {
    this.loading = true;
    setTimeout(() => {
      if (this.reucaristias) {
        const q: QueryOptions = new QueryOptions(); //El archivo para paginar los articulos realizado en spring tools
        q.pageSize = event.rows;
        //********* CALCULO DE LA PAGINA */
        let page = Math.ceil(event.first / this.numerofilas);
        this.pagina = page;
        if (page < 0) {
          page = 0;
        }
        q.pageNumber = page;
      
        q.sortField = event.sortField;
        q.sortOrder = event.sortOrder;
        if (event.filters.global) {
          this.ReservacionEucaristiaServicio.find(q, event.filters.global.value).subscribe(resp => {
            this.reucaristias = resp.content;
            this.totalrecords = resp.totalElements*1;
          });
        } else {
          this.ReservacionEucaristiaServicio.list(q).subscribe(resp => {
            this.reucaristias = resp.content;
            this.totalrecords = resp.totalElements*1;
          });
        }
        this.loading = false;
      }
    }, 1000);
  }

//******** LISTA LA RESERVACION DE EUCARISTIA */
  listar(){
    this.ReservacionEucaristiaServicio.getReservacionesEucaristias().subscribe(data => {
      this.reucaristias = data;
      this.totalrecords=this.reucaristias.length;
    });
  }
 //********* XARGA LOS DATOS PARA GENERAR EL REPORTE  */
  cargarDatosReporte(){
    this.dis2 = true;
    this.ListaReporteEuca =[];
    this.seleccionEucaristiaRe="";
    try{
      if(this.tipoEucaristiaSelect.tipeNombre==null){
        this.seleccionEucaristiaRe="TODOS LOS REGISTROS"
        for (let index = 0; index < this.reucaristias.length; index++){
          this.fechaReservacion =new Date (this.reucaristias[index].reseFkCalendario.caleFecha);
          if((this.fechaReservacion.getTime() > this.fecInicio.getTime()) && (this.fechaReservacion.getTime() < this.fecFin.getTime())){
            this.ListaReporteEuca.push(this.reucaristias[index]);
          }
        }
      }else{
        this.seleccionEucaristiaRe=this.tipoEucaristiaSelect.tipeNombre;
        for (let index = 0; index < this.reucaristias.length; index++){
          this.fechaReservacion =new Date (this.reucaristias[index].reseFkCalendario.caleFecha);
          if((this.fechaReservacion.getTime() > this.fecInicio.getTime()) && (this.fechaReservacion.getTime() < this.fecFin.getTime())){
            if(this.tipoEucaristiaSelect.tipeNombre==this.reucaristias[index].reseFkTiposeucaristias.tipeNombre){
              this.ListaReporteEuca.push(this.reucaristias[index]);
            }
          }
        }
      }
    }catch(e){

    }
    
  }
//*** OPCION PARA CREAR NUEVAS RESERVAS */
  crearNuevo(){
    this.router.navigateByUrl("serviciospastorales/usuario/eucaristia-reservacionusuario");
  }
//******* CARAGA LOS DATOS POR DEFECTO */
  cargarDatos(){
    var Otros:string = this.addForm.get('reseOtros').value;
    var Descripcion:string = this.addForm.get('reseDescripcion').value;
    var valorFijo: number = this.addForm.get('reseValorfijo').value;

    this.Persona =  this.buscarCedula(this.addForm.get('reseCedula').value);
    this.tipoEucaristiaSelect = this.reseTiposeucaristias.value;

    this.reucaristia2.reseOtros = Otros;
    this.reucaristia2.reseDescripcion = Descripcion;
    this.reucaristia2.reseValorfijo=valorFijo;    
    this.reucaristia2.reseFechareservacion=this.addForm.get('reseFechareservacion').value;   
    this.reucaristia2.reseEstado=this.checked1;   
    this.reucaristia2.reseFkCalendario= this.reucaristia2.reseFkCalendario;   
    this.reucaristia2.reseFkPersona=this.Persona;   
    this.reucaristia2.reseFkTiposeucaristias=this.tipoEucaristiaSelect;
  }
//*******  BUSCA POR IDENTIFICADOR (CEDULA) */
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
  }
//*******   ACTUALIZA LOS DATOS GENERADOS */
  ActualizarDatos(){
    if (this.addForm.invalid) {
      this.dis=false;
      console.log(this.reucaristia2);
      Swal.fire(
        'Error al Actualizar',
         `Existen campos erróneos`,
        "error")
      return;
    }else{
      this.reucaristia2.reseEstado = this.checked1;
      this.ReservacionEucaristiaServicio.update(this.reucaristia2).subscribe(data =>{
        this.listar();
        this.dis=false;
        Swal.fire(
          'Actualizado Existosamente',
           `Se actualizo el objeto correctamente`,
        "success")
        this.addForm.reset();
        this.listar()
      });
    }
    this.disable();
  }
//********* ELIMINA LAS RESVACIONES GENERADAS */
  EliminarTipo(ReseEuca: ReservacionEucaristia) {
    Swal.fire({
      title:'Eliminar Reservación de Eucaristía',
      text: `¿Desea Eliminar la Reservación ${ReseEuca.reseDescripcion} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
      this.ReservacionEucaristiaServicio.delete(ReseEuca.reseId).subscribe(
        response => {
          this.reucaristias = this.reucaristias.filter(servi => servi !== ReseEuca)
          this.listar();
          Swal.fire('Reservación Eliminada!','','success')
        }
      )
    }else if(result.isDenied){}
    });
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('Inicio', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
//******** CARAG TODOS LOS TIPOS GENERADOS */
  cargarTiposEucarista(ReseEuca: ReservacionEucaristia): void {
    this.addForm.reset();
    localStorage.setItem("reseId", ReseEuca.reseId.toString());
    let tipeId = localStorage.getItem('reseId');
    this.ReservacionEucaristiaServicio.getReservacionEucaristia(+tipeId)
    .subscribe(data =>{
      this.reucaristia2 = data
      this.checked1 = this.reucaristia2.reseEstado;
      this.reseHora.setValue(this.reucaristia2.reseFkCalendario.caleFecha+"");
      this.reseCedula.setValue(this.reucaristia2.reseFkPersona.persCedula+"");
      this.resePersona.setValue(this.reucaristia2.reseFkPersona.persNombre+" "+this.reucaristia2.reseFkPersona.persApellido);
      console.log(this.reucaristia2);
      this.dis = true;
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
  get reseTiposeucaristiasBusqueda(){return this.addForm1.get('reseTiposeucaristias');}
  get reseHora(){return this.addForm.get('reseHora');}
  get reseCedula(){return this.addForm.get('reseCedula');}

  handleChange(e) {
    this.checked1 = e.checked;
  
  }

}
//******* MUESTRA EL INETERFAZ DE ESTADO */
interface EstadoInterf {
  name: string;
  estado: boolean;
}