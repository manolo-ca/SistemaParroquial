import { Component, OnInit } from '@angular/core';
import { FilterUtils, LazyLoadEvent, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import{TipoEucaristia} from './tipoeucaristia';
import { TipoEucaristiaService } from './tipoeucaristia.service';
import { QueryOptions } from 'src/app/spring-generic-mvc/model/QueryOptions';
import { TipodocumentoService } from '../tiposdocumentos/tipodocumento.service';
import { Tipodocumento } from '../tiposdocumentos/tipodocumento';
import swal from 'sweetalert2';
import { Servicio } from '../servicioslista/servicio';
import { ServicioService } from '../servicioslista/servicio.service';
@Component({
  selector: 'app-tipoeucaristias',
  templateUrl: './tipoeucaristias.component.html'
})
export class TipoeucaristiasComponent implements OnInit {

  teucaristias = new Array<TipoEucaristia>();
  teucaristia : TipoEucaristia = new TipoEucaristia();
  teucaristias2 :TipoEucaristia = new TipoEucaristia();

  addForm1: FormGroup =new FormGroup({
    tipeNombre: new FormControl ('',[Validators.required]),
    reseTiposeucaristias: new FormControl ('',[Validators.required]),
    tipeValor: new FormControl ('',[Validators.required]),
    tipeFkServicio: new FormControl ('',[Validators.required]),
  });

  botonDis : boolean = false;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  selectedTipo: any[];

  bandera = false;

  loading = true;
  totalrecords;
  numerofilas = 10;
  pagina = 0;

  tipoeuEditar :TipoEucaristia;
  tipoEucaristia : TipoEucaristia[];

  documentos : Tipodocumento[];
  documento : Tipodocumento=new Tipodocumento();

  servicioLista: Servicio[];
  servicio : Servicio = new Servicio();

  TipoEucaristiaPrivacidad : TipoEuca[];
  TipoEucaristiaPrivacidadSelect : TipoEuca = new TipoEuca();
  submitted: boolean;

  showDialog() {
    this.dis = true;
  }
  
  constructor(private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder, private TipoEucaristiaServicio:TipoEucaristiaService, private TipoDocumentoServicio: TipodocumentoService, private ServicioServicio : ServicioService) { }
//********* PERMITE INICIALIZAR EL COMPONENTE UNA INGRESADO LAS PROPIEDADES DE ENTRADA */
  ngOnInit() {

    this.cols = [
        { field: 'tipeId', header: 'Código' },
        { field: 'tipeNombre', header: 'Nombre' },
        { field: 'tipeTipo', header: 'Tipo' },
        { field: 'tipeValor', header: 'Valor' },
        { field: 'tipeFkServicio', header: 'Descripción del Servicio' }
    ];
    
    this.TipoEucaristiaPrivacidad = [{name: "Publica", estado:"PUBLICA"},{name: "Privada", estado:"PRIVADA"}]

    this.TipoEucaristiaServicio.listarTipoEucaristia().subscribe(data => {
      this.teucaristias = data;
      this.totalrecords=this.teucaristias.length;
    });

    this.ServicioServicio.getServicios().subscribe(data => {
      this.servicioLista = data;
    });

    this.TipoDocumentoServicio.getTiposDocumentos().subscribe(data => {
      this.documentos = data;
    });

    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      return parseInt(filter) > value;
    }
    
    this.selectedTipo=this.cols;
    this.loading = true;
    this.TipoEucaristiaPrivacidad = [
      {name: 'Privado', estado:'privado'},
      {name: 'Publico', estado:'publico'}
    ];
  }
//******* LISTA LA TABLA DE INICIO CON TODOS LOS REGISTROS */
  listarTabla() {
    const q: QueryOptions = new QueryOptions();
    q.pageSize = this.numerofilas;
    q.pageNumber = this.pagina;
    this.TipoEucaristiaServicio.list(q).subscribe(resp => {
      this.teucaristias = resp.content;
      this.totalrecords = resp.totalElements;
    });
  }

  columnFilter(event: any) {
  }

  disable(){
    this.dis=false;
    this.botonDis=false;
    this.addForm1.reset();
  }
  onRowSelect(e) {
  }

  loadTipoLazy(event: LazyLoadEvent) {
    this.loading = true;
//****** EJECUTA UNA FUNCION DESPUES DE QUE TERMINAR CON OTRA */
    setTimeout(() => {
        if (this.teucaristias) {
            this.teucaristias = this.teucaristias.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
  }

  loadCarsLazy(event) {
    this.loading = true;
//********* EJECUTA UNA FUNCION DESPUES DE QUE TERMINE OTRA */
    setTimeout(() => {
      if (this.teucaristias) {
        const q: QueryOptions = new QueryOptions(); 
        q.pageSize = event.rows;
       
        let page = Math.ceil(event.first / this.numerofilas);
        this.pagina = page;
        if (page < 0) {
          page = 0;
        }
        q.pageNumber = page;
     
        q.sortField = event.sortField;
        q.sortOrder = event.sortOrder;
        if (event.filters.global) {
          this.TipoEucaristiaServicio.find(q, event.filters.global.value).subscribe(resp => {
            this.teucaristias = resp.content;
            this.totalrecords = resp.totalElements*1;
          });
        } else {
          this.TipoEucaristiaServicio.list(q).subscribe(resp => {
            this.teucaristias = resp.content;
            this.totalrecords = resp.totalElements*1;
          });
        }

        this.loading = false;
      }
    }, 1000);
  }


  get tipeNombre(){return this.addForm1.get('tipeNombre');}
  get reseTiposeucaristias(){return this.addForm1.get('reseTiposeucaristias');}
  get tipeValor(){return this.addForm1.get('tipeValor');}
  get tipeFkServicio(){return this.addForm1.get('tipeFkServicio');}

  
  //******** LISTA LOS TIPOS DE EUCARISTIA */
  listar(){
    this.TipoEucaristiaServicio.listarTipoEucaristia().subscribe(data => {
      this.teucaristias = data;
      this.totalrecords=this.teucaristias.length;
    });
  }

  //******** VALIDA CAMPOS NO DEBEN ESTRA VACIOS O INCORRECTOS */
  onSubmit() {
    this.submitted=true;
    if (this.addForm1.invalid) {
      this.dis=false;
      swal.fire(
        'Error al Agregar',
         `Existen campos incorrectos`,
        "error")
      return;
    }else{
      console.log(this.addForm1.value);
      console.log(this.teucaristias2);
      this.teucaristias2.tipeTipo=this.TipoEucaristiaPrivacidadSelect.name;
      this.TipoEucaristiaServicio.crearTipoEucaristia(this.teucaristias2).subscribe(data => {
        this.dis=false;
        swal.fire(
          'Agregado Existosamente',
         `Se Agrego Tipo de Eucaristía`,
          "success")
        this.addForm1.reset();
        this.listar();
      });
    }
  }
//************* EDITA LOS DATOS QUE ESTAN ACTUALMENTE  */
  ActualizarDatos(){
    if (this.addForm1.invalid) {
      this.dis=false;
      swal.fire(
        'Error al Actualizar',
      `Existen campos erróneos`,
        "error")
      return;
    }else{
      this.teucaristias2.tipeTipo=this.TipoEucaristiaPrivacidadSelect.name;
      this.TipoEucaristiaServicio.ActualizarTipoEucaristia(this.teucaristias2).subscribe(data =>{
        this.listar();
        this.dis=false;
        swal.fire(
          'Actualizado Existosamente',
           `Se actualizo el objeto correctamente`,
          "success")
        this.addForm1.reset();
        this.reload("/serviciospastorales/administrar/eucaristia-tipos");
      });
    }
    this.disable();
  }
//***** ELIMINA EL TIPO DE EUCARISTIA INGRESADO */
  EliminarTipo(tipoEuca: TipoEucaristia) {
    swal.fire({
      title:'Eliminar Tipo de Eucaristía',
      text: `¿Desea Eliminar la Eucaristía ${tipoEuca.tipeNombre} ?`,
      showDenyButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cancelar`,
    }).then((result)=>{
      if(result.isConfirmed){
      this.TipoEucaristiaServicio.EliminarTipoEucaristia(tipoEuca.tipeId).subscribe(
        response => {
          this.teucaristias = this.teucaristias.filter(servi => servi !== tipoEuca)
         
        }
        
      )
     
    swal.fire('Eliminada','','success')
    
    }else if(result.isDenied){

    }
    });
  }
//******** REGRESCA LAS PAGINAS */
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
//***** CARA LA LISTA UNA VEZ REALIZADO UNA TAREA */
  cargarTiposEucarista(tipoEucaristi: TipoEucaristia): void {
    this.botonDis=true;
    localStorage.setItem("tipeId", tipoEucaristi.tipeId.toString());
    let tipeId = localStorage.getItem('tipeId');
    this.TipoEucaristiaServicio.getTipoEucaristia(+tipeId).subscribe((data) =>
      this.teucaristias2 = data);
    this.dis = true;
  }


}
class TipoEuca {
  name: string;
  estado: string;
}