import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { matriculaAlumno } from './matriculaAlumno';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/matricula/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/matricula/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/matricula/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/matricula/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/matricula/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })


  constructor(
    private http: HttpClient
  ) { }

  getMatriculas(): Observable<matriculaAlumno[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as matriculaAlumno[])
    );
  }

  createMatricula(matricula: matriculaAlumno): Observable<matriculaAlumno> {
    return this.http.post<matriculaAlumno>(this.urlCreate, matricula,
      { headers: this.httpHeaders })
  }

  getMatricula(codigo): Observable<matriculaAlumno> {
    return this.http.get<matriculaAlumno>(`${this.urlSearch}/${codigo}`)
  }

  updateMatricula(matricula: matriculaAlumno): Observable<matriculaAlumno> {
    return this.http.put<matriculaAlumno>(`${this.urlUpdate}/${matricula.matrId}`,
    matricula, { headers: this.httpHeaders })
  }

  deleteMatricula(id: number): Observable<matriculaAlumno> {
    return this.http.delete<matriculaAlumno>(`${this.urlDelete}/${id}`,
      { headers: this.httpHeaders })
  }
}
