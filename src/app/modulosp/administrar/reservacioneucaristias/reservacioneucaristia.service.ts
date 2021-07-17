import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs'
import { ReservacionEucaristia } from './reservacioneucaristia';
import { environment } from 'src/environments/environment.prod';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericService } from 'src/app/spring-generic-mvc/service/generic.service';


@Injectable()
export class ReservacionEucaristiaService extends GenericService<ReservacionEucaristia>{
  private url_mater: string =environment.URL_BACKEND;

  private UrlEndPoint:string = "http://"+this.url_mater+"/sj/reservacioneucaristia";
  
  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  }

  constructor(private http: HttpClient) {
    super(
      http,
      environment.URL_BACKEND,
      'sj/reservacioneucaristia'
    )
  } 
//********* SE CREA UNA RESERVACION */
  crearReservacion(reseEuca: ReservacionEucaristia): Observable<ReservacionEucaristia>{
      return this.http.post<ReservacionEucaristia>(`${this.UrlEndPoint}/guardar`,reseEuca);
  }

  getReservacionesEucaristias(): Observable<ReservacionEucaristia[]> {
    return this.http.get(`${this.UrlEndPoint}/listar`).pipe(
      map(response => response as ReservacionEucaristia[])
    );
  }
  
  getReservacionEucaristia(docuId): Observable<ReservacionEucaristia> {
    return this.http.get<ReservacionEucaristia>(`${this.UrlEndPoint}/buscar/${docuId}`)
  }
  
  update(reservacion: ReservacionEucaristia): Observable<ReservacionEucaristia> {
    return this.http.put<ReservacionEucaristia>(`${this.UrlEndPoint}/editar/${reservacion.reseId}`, reservacion, { headers: this.httpOptions.headers })
  }

  delete(docuId: number): Observable<ReservacionEucaristia> {
    return this.http.delete<ReservacionEucaristia>(`${this.UrlEndPoint}/borrar/${docuId}`, { headers: this.httpOptions.headers})
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
