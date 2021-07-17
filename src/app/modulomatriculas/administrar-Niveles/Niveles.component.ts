import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Nivel} from './Nivelservicio';
import { administarnivelservice } from './Nivel.service';
import Swal from 'sweetalert2';
import { matriculaAlumno } from '../matriculaalumno-registrado/matriculaAlumno';
import { MatriculaService } from '../matriculaalumno-registrado/matricula.service';

@Component({
  selector: 'app-servicioslista',
  templateUrl: './Niveles.component.html'
})

export class AdministrarNivelComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE NIVELES-----------------------*/
  servicio: Nivel[];
  private servicio2: Nivel = new Nivel();
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  ListaMatriculas: matriculaAlumno[];

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: administarnivelservice ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private MatriculasServicio : MatriculaService
  ){ 

  }

  ngOnInit() {

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.addForm2 = this.formBuilder.group({
      nivel_nombre: ['', Validators.required]
    });

    /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULAS. EL METÓDO PARA LISTAR TODAS LAS MATRÍCULAS Y ALMACENAMOS-----------------------*/
    this.MatriculasServicio.getMatriculas().subscribe(
      servicio => this.ListaMatriculas = servicio
    );

    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR LOS NIVELES-----------------------*/
    this.listarNiveles();
  }

  /*-----------------------MÉTODO PARA RECUPERAR VALORES DEL FORMULARIOS DEL CAMPO NIVEL NOMBRE-----------------------*/
  get nivel_nombre(){return this.addForm2.get('nivel_nombre');}

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA AGREGAR UN NUEVO NIVEL-----------------------*/
  showDialog() {
    this.addForm2.reset();
    this.dis = true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE NIVELES. EL METÓDO PARA LISTAR TODOS LOS NIVELES Y ALMACENAMOS-----------------------*/
  listarNiveles(){
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE NIVEL. EL METÓDO PARA ALMACENAR UN NUEVO NIVEL-----------------------*/
  public create(): void {
    if(this.addForm2.invalid){
      this.dis=false;
      Swal.fire(
        'Campos erroneos',
        'Verifique que no existan campos vacios y datos correctos.',
        'error');
    }else{
      this.servicio2.niveNombre = this.addForm2.get("nivel_nombre").value;
      this.servicioService.create(this.servicio2).subscribe(
        Response => {
          Swal.fire(
            'Nivel Registrado',
            'El nivel se registro correctamente.',
            'success');
          this.dis=false;
          this.reload('niveles');
        }
      )
    }
  }

  /*-----------------------METÓDO PARA RECARGAR LA VENTANA DE NIVEL-----------------------*/
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('Inicio', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE NIVEL. EL METÓDO PARA ELIMINAR UN NIVEL MEDIANTE EL ID-----------------------*/
  delete(servicio:Nivel): void {
    var bandera : Boolean =false;
    for (let index = 0; index < this.ListaMatriculas.length; index++) {
      if(servicio.niveNombre == this.ListaMatriculas[index].matrFkNivel.niveNombre){
        bandera = true;
      }
    }
    Swal.fire({
      title:'Eliminar Nivel',
      text: `¿Desea Eliminar el nivel ${servicio.niveNombre} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        if(bandera == false){
          this.servicioService.delete(servicio.niveId).subscribe(
            response => {
              this.servicio = this.servicio.filter(servi => servi !== servicio)
              Swal.fire('Nivel Eliminado!','Los cambios no se pueden revertir','success')
              this.reload('niveles');
            }
          )
        }else{
          Swal.fire(
            'Nivel en Uso',
            'No se puede eliminar este nivel.',
            'question');
        } 
      }
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE NIVEL. EL METÓDO PARA BUSCAR UN NIVEL MEDIANTE EL ID-----------------------*/
  cargarServicio(servicio:Nivel): void {
    localStorage.setItem("servId", servicio.niveId.toString());
    let servId = localStorage.getItem('servId');
    this.servicioService.getServicio(+servId).subscribe((data) =>
    this.servicio2 = data)
    this.dis = true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE NIVEL. EL METÓDO PARA ACTUALIZAR UN NIVEL-----------------------*/
  public update(): void {
    this.servicioService.update(this.servicio2).subscribe(cliente => {
      this.listarNiveles();
      this.dis = false;
    })
  }
}