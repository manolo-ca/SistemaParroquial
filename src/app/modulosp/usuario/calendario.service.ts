import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs'
import { Calendario } from './calendario';
import { environment } from 'src/environments/environment.prod';
import { throwError } from 'rxjs';
import { GenericService }from "src/app/spring-generic-mvc/service/generic.service";

@Injectable()
export class CalendarioService extends GenericService<Calendario>{

  private url_mater: string =environment.URL_BACKEND;

    private UrlEndPoint:string = "http://"+this.url_mater+"/sj/calendario";
    
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    }

    constructor(private http: HttpClient) {
      super(
        http,
        environment.URL_BACKEND,
        'sj/calendario'
      )
    } 

    crearEvento(cale: Calendario): Observable<Calendario>{
        return this.http.post<Calendario>(`${this.UrlEndPoint}/guardar`,cale, { headers: this.httpOptions.headers });
    }

    listarEventos(): Observable<Calendario[]>{
        return this.http.get<Calendario[]>(`${this.UrlEndPoint}/listar`);
    }

    getEvento(tipeId): Observable<Calendario> {
      return this.http.get<Calendario>(`${this.UrlEndPoint}/buscar/${tipeId}`)
    }

    ActualizarEvento(cale: Calendario): Observable<Calendario> {
      return this.http.put<Calendario>(`${this.UrlEndPoint}/editar/${cale.caleId}`, cale, { headers: this.httpOptions.headers })
    }

    EliminarEvento(tipdId: number): Observable<Calendario> {
      return this.http.delete<Calendario>(`${this.UrlEndPoint}/borrar/${tipdId}`, { headers: this.httpOptions.headers })
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
