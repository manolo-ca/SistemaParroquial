import { Injectable } from '@angular/core';
import { Persona } from './persona';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/personas/listar/';
  private urlReadProveedor: string = 'http://'+this.url_mater+'/sj/personas/listarPersonas/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/personas/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/personas/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/personas/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/personas/buscar/';
  private urlSearchCedula: string = 'http://'+this.url_mater+'/sj/personas/searchCedula?filtro=';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Persona[])
    );
  }
  listarPersonasProveedor(): Observable<Persona[]> {
    return this.http.get(this.urlReadProveedor).pipe(
      map(response => response as Persona[])
    );
  }
  create(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.urlCreate, persona, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al guardar', 'NO se puede guardar a la persona, revise la cedula que no este repetida!!', 'error')
        return throwError(e);
      })
    );
  }

  getPersona(persId): Observable<Persona> {
    return this.http.get<Persona>(`${this.urlSearch}/${persId}`).pipe(
      catchError(e => {
        swal.fire('Error al cargar', 'NO se puede encontrar a la persona', 'error')
        return throwError(e);
      })
    );
  }
  getPersona2(persCedula): Observable<any> {
    return this.http.get<any>(`${this.urlSearchCedula}${persCedula}`).pipe(
      catchError(e => {
        swal.fire({
          title: 'Error al buscar',
          text: 'La persona no se encuentra registrada, desea ingresarla al sistema',
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Agregar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/resgistro-personas']);
          }
        })
        return throwError(e);
      })
    );
  }
  getPersona3(persCedula): Observable<any> {
    return this.http.get<any>(`${this.urlSearchCedula}${persCedula}`).pipe(
      catchError(e => {
        return throwError("No");
      })
    );
  }
  update(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.urlUpdate}/${persona.persid}`, persona, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al actualizar', 'NO se puede actualizar a la persona', 'error')
        return throwError(e);
      })
    );
  }

  delete(persid: number): Observable<Persona> {
    return this.http.delete<Persona>(`${this.urlDelete}/${persid}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire('Error al eliminar', 'NO se puede eliminar', 'error')
        return throwError(e);
      })
    );
  }
}