import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';
import swal from 'sweetalert2'
@Component({
  selector: 'app-servicioslista',
  templateUrl: './servicioslista.component.html'

})
export class ServicioslistaComponent implements OnInit {

  servicio: Servicio[];
  private servicio2: Servicio = new Servicio();

  files: TreeNode[];
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  showDialog() {
    this.servicio2.servId = null;
    this.servicio2.servNombre = null;
    this.servicio2.servDescripcion = null;
    this.dis = true;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private servicioService: ServicioService,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.nodeService.getFilesystem().then(files => this.files = files);
    this.listar();
  }
//********* LISTA LOS SERVICIOS DISPONIBLES */
  public listar(): void {
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );
  }
//*********** CREA LA LISTA DE SERVICIO Y GUARDA */
  public create(): void {
    if (this.servicio2.servNombre == null || this.servicio2.servDescripcion == null) {
      this.dis = false;
      swal.fire(
        'Error al Guardar',
        'Revise los datos de entrada',
        'error'
      )
    } else {
      this.dis = false;
      this.servicioService.create(this.servicio2).subscribe(
        Response => {
          swal.fire(
            'Servicio Guardado',
            `Servicio ${this.servicio2.servNombre} creado con exito!`,
            'success'
          )
          this.listar();
        }
      )
    }
  }
//********* ELIMINA UN SERVICIO */
  delete(servicio: Servicio): void {
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
        this.servicioService.delete(servicio.servId).subscribe(
          response => {
            this.servicio = this.servicio.filter(servi => servi !== servicio)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Su servicio fue eliminado.`,
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
//********* CARGA TODOS LOS SERVICIOS  */
  cargarServicio(servicio: Servicio): void {
    localStorage.setItem("servId", servicio.servId.toString());
    let servId = localStorage.getItem('servId');
    this.servicioService.getServicio(+servId).subscribe((data) =>
      this.servicio2 = data)
    this.dis = true;
  }
//********** EDITA LOS SERVICOS DISPONIBLES */
  public update(): void {
    if (this.servicio2.servNombre == null || this.servicio2.servDescripcion == null) {
      this.dis = false;
      swal.fire(
        'Error al Editar',
        'Revise los datos de entrada',
        'error'
      )
    } else {
      this.dis = false;
      this.servicioService.update(this.servicio2)
        .subscribe(cliente => {
          swal.fire(
            'Servicio Actualizado',
            `Servicio ${this.servicio2.servNombre} Actualizado con exito!`,
            'success'
          )
          this.listar();
        }
        )
    }
  }
//******** PARA REFRESCAR */
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
}