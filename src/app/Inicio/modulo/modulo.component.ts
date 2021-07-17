import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styles: ['./modulo.component.css'],

  encapsulation: ViewEncapsulation.None
})
export class ModuloComponent implements OnInit {


  images: any[];

  modulos: any[];

  responsiveOptions;


  constructor() { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }
  

    
  ngOnInit() {
      this.images = [];
      this.images.push({source:'assets/layout/ista/2.png', alt:'Internet es como un gran inventario de información, pero no constituye en sí misma la memoria.', title:'Umberto Eco'});
      this.images.push({source:'assets/layout/ista/9.jpg', alt:'El liderazgo efectivo es poner primero lo primero. La gestión eficaz es la disciplina llevada a cabo.', title:'Stephen Covey'});
      this.modulos=[
        { name : 'Servicios Pastorales', descripcion :'Gestión de Servicio Pastorales',path:'servicep', pathModulo:'serviciospastorales/administrar/servicios-lista'},
        {name : 'Matriculas de Catequesis', descripcion :'Catequesís de la Parroquia' ,path:'matriculas',pathModulo:'catequesis/matricula-catequesis'},
        {name : 'Facturación, Compra y Venta', descripcion :'Gestión de ingresos y egresos',path:'facturacion',pathModulo:'facturacion/facturar'},
        {name : 'Calendario', descripcion :'Eventos de la Parroquia',path:'calendario',pathModulo:'calendario/usuario'},
        {name : 'Bodega', descripcion :'Inventario de la Parroquia',path:'bodega',pathModulo:'bodega/inventario'}
    
    ]

  
    }


}

interface modulos{
  name : string;
  descripcion : string;
  path: string;
  pathModulo : string;
}
