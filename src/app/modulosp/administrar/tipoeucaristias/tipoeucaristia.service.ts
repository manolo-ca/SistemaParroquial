import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs'
import { TipoEucaristia } from './tipoeucaristia';
import { environment } from 'src/environments/environment.prod';
import { throwError } from 'rxjs';
import { GenericService }from "src/app/spring-generic-mvc/service/generic.service";

@Injectable()
export class TipoEucaristiaService extends GenericService<TipoEucaristia>{

  private url_mater: string =environment.URL_BACKEND;

  private UrlEndPoint:string = "http://"+this.url_mater+"/sj/teucaristia";

  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  }

  constructor(private http: HttpClient) {
    super(
      http,
      environment.URL_BACKEND,
      'sj/teucaristia'
    )
  } 

  crearTipoEucaristia(tipoEuca: TipoEucaristia): Observable<TipoEucaristia>{
      return this.http.post<TipoEucaristia>(`${this.UrlEndPoint}/guardar`,tipoEuca, { headers: this.httpOptions.headers });
  }
  listarTipoEucaristia(): Observable<TipoEucaristia[]>{
    return this.http.get<TipoEucaristia[]>(`${this.UrlEndPoint}/listar`);
  }
  listarTipoEucaristiaPublico(): Observable<TipoEucaristia[]>{
      return this.http.get<TipoEucaristia[]>(`${this.UrlEndPoint}/listarPublico`);
  }
  listarTipoEucaristiaPrivado(): Observable<TipoEucaristia[]>{
    return this.http.get<TipoEucaristia[]>(`${this.UrlEndPoint}/listarPrivado`);
  }


  getTipoEucaristia(tipeId): Observable<TipoEucaristia> {
    return this.http.get<TipoEucaristia>(`${this.UrlEndPoint}/buscar/${tipeId}`)
  }

  ActualizarTipoEucaristia(tipoEuca: TipoEucaristia): Observable<TipoEucaristia> {
    return this.http.put<TipoEucaristia>(`${this.UrlEndPoint}/editar/${tipoEuca.tipeId}`, tipoEuca, { headers: this.httpOptions.headers })
  }

  EliminarTipoEucaristia(tipdId: number): Observable<TipoEucaristia> {
    return this.http.delete<TipoEucaristia>(`${this.UrlEndPoint}/borrar/${tipdId}`, { headers: this.httpOptions.headers })
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
