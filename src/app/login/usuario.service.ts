import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { Usuario} from './login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private isUserLoggedIn;
  public usserLogged:Usuario;
  private url_mater: string =environment.URL_BACKEND;

  private UrlEndPoint:string = "http://"+this.url_mater+"/sj/usuario";
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http:HttpClient) {
  	this.isUserLoggedIn = false;
  }

  setUserLoggedIn(user:Usuario) {
    this.isUserLoggedIn = true;
    this.usserLogged = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  
  }

  getUserLoggedIn() {
  	return JSON.parse(localStorage.getItem('currentUser'));
  }

  crearUsuario(user: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.UrlEndPoint}/guardar`,user, { headers: this.httpHeaders});
  }
  listarUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.UrlEndPoint}/listar`);
  }

  getUsuario(user): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.UrlEndPoint}/buscar/${user}`)
  }

  ActualizarUsuario(user: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.UrlEndPoint}/editar/${user.usuaId}`, user, { headers: this.httpHeaders})
  }

  EliminarUsuario(user: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.UrlEndPoint}/borrar/${user}`, { headers: this.httpHeaders })
  }
    errorHandl(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

