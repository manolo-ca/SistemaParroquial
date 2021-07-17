import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Periodo} from './Periodoservicio';
import { AdministrarPeriodoComponentservice} from './Periodo.service';
import Swal from 'sweetalert2';
import { matriculaAlumno } from '../matriculaalumno-registrado/matriculaAlumno';
import { MatriculaService } from '../matriculaalumno-registrado/matricula.service';

@Component({
  selector: 'app-servicioslista',
  templateUrl: './Periodo.component.html'
})

export class AdministrarPeriodoComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE PERIODOS-----------------------*/
  servicio: Periodo[];
  private servicio2: Periodo = new Periodo();
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  date :Date = new Date();
  date2 :Date = new Date();
  boton : boolean;
  ListaMatriculas: matriculaAlumno[];

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: AdministrarPeriodoComponentservice ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private MatriculasServicio : MatriculaService
  ){

  }

  ngOnInit() {

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.addForm2 = this.formBuilder.group({
      periodo_inicio: ['', Validators.required],
      periodo_fin: ['', Validators.required]
    });
 
    /*-----------------------LLAMAMOS AL METODO PARA LISTAR LOS PERIODOS-----------------------*/
    this.listarPeriodos();

    /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULAS. EL METÓDO PARA LISTAR TODAS LAS MATRÍCULAS Y ALMACENAMOS-----------------------*/
    this.MatriculasServicio.getMatriculas().subscribe(
      servicio => this.ListaMatriculas = servicio
    );


  }

  /*-----------------------MÉTODO PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
  get periodo_inicio(){return this.addForm2.get('periodo_inicio');}
  get periodo_fin(){return this.addForm2.get('periodo_fin');}

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA AGREGAR UN NUEVO PERIODO-----------------------*/
  showDialog() {
    this.boton=false;
    this.dis = true;
    this.addForm2.reset();
  }
  
  /*-----------------------LLAMAMOS AL SERVICIO DE PERIODOS. EL METÓDO PARA LISTAR TODOS LOS PERIODOS Y ALMACENAMOS-----------------------*/
  listarPeriodos(){
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERIODO. EL METÓDO PARA ALMACENAR UN NUEVO PERIODO-----------------------*/
  public create(): void {
    if(this.addForm2.invalid){
      this.dis=false;
      Swal.fire(
        'Campos erroneos',
        'Verifique que no existan campos vacios y datos correctos.',
        'error');
    }else{
      this.servicio2.periInicio = this.date;
      this.servicio2.periFin= this.date2;
      this.servicio2.periId=null;
      this.servicioService.create(this.servicio2).subscribe(
        Response => {
          Swal.fire(
            'Nuevo Periodo',
            'Periodo nuevo se registro correctamente.',
            'success');
          this.dis=false;
          this.listarPeriodos();
  
        }
      )
    }
  }

  /*-----------------------METÓDO PARA RECARGAR LA VENTANA DE PERIODOS-----------------------*/
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('Inicio', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERIODO. EL METÓDO PARA ELIMINAR UN PERIODO MEDIANTE EL ID-----------------------*/
  delete(servicio:Periodo): void {
    var bandera1 : Boolean =false;
    for (let index = 0; index < this.ListaMatriculas.length; index++) {
      if(servicio.periInicio == this.ListaMatriculas[index].matrFkPeriodo.periInicio){
        bandera1 = true;
      }
    }
    Swal.fire({
      title:'Eliminar Periodo',
      text: `¿Desea Eliminar el Periodo ${servicio.periId} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        if(bandera1 == false){
          this.servicioService.delete(servicio.periId).subscribe(
            response => {
              this.servicio = this.servicio.filter(servi => servi !== servicio)
              Swal.fire('Periodo Eliminado!','Los cambios no se pueden revertir','success')
              this.listarPeriodos();
            }
          )
        }else{
          Swal.fire(
            'Periodo en uso',
            'No se puede eliminar este Periodo',
            'question');
        } 
      }
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERIODO. EL METÓDO PARA BUSCAR UN PERIODO MEDIANTE EL ID-----------------------*/
  cargarServicio(servicio:Periodo): void {
    this.boton=true;
    localStorage.setItem("servId", servicio.periId.toString());
    let servId = localStorage.getItem('servId');
    this.servicioService.getServicio(+servId).subscribe(data =>{
      this.servicio2 = data;
      this.date = new Date(this.servicio2.periInicio.toString());
      this.date2 = new Date(this.servicio2.periFin.toString());
    })
    this.dis = true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE NIVEL. EL METÓDO PARA ACTUALIZAR UN PERIODO-----------------------*/
  public update(): void {
    this.servicio2.periInicio = this.date;
    this.servicio2.periFin = this.date2;
    this.servicioService.update(this.servicio2)
      .subscribe(periodo => {
        Swal.fire(
          'Periodo Actualizado',
          'El periodo se actualizo correctamente',
          'success');
        this.dis = false;
        this.listarPeriodos();
      }
    )
  }
}