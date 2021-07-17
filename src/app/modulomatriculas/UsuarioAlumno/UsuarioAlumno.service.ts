import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Alumno } from '../AdministrarAulmno/AdministrarAlumnoservicio';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class UsuarioAlumnosservice {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/alumnos/listar';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/alumnos/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/alumnos/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/alumnos/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/alumnos/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable<Alumno[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Alumno[])
    );
  }
  createAl(cliente: Alumno): Observable<Alumno> {
    
    return this.http.post<Alumno>(this.urlCreate, cliente,
      { headers: this.httpHeaders })
  }
  
  getServicio(codigo): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.urlSearch}/${codigo}`)
  }

  update(Aula: Alumno): Observable<Alumno> {
  
    return this.http.put<Alumno>(`${this.urlUpdate}`,
    Aula, { headers: this.httpHeaders })
  }

  delete(codigo: number): Observable<Alumno> {
    return this.http.delete<Alumno>(`${this.urlDelete}/${codigo}`,
      { headers: this.httpHeaders })
  }
}
