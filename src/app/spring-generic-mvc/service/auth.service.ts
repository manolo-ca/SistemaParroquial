import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryOptions } from '../model/QueryOptions';
import { map } from 'rxjs/operators';
import { Page } from '../model/Page';
import { environment } from 'src/environments/environment';


export class AuthService {
  constructor(
    private httpClient: HttpClient,
    // , private serializer: Serializer
  ) { }

  public login(item): Observable<any> {
    return this.httpClient
      .post<any>(`http://${environment.URL_BACKEND}/usuario/logueo`, item)
      .pipe(map(data => data as any));
  }
  public registro(item): Observable<any> {
    return this.httpClient
      .post<any>(`http://${environment.URL_BACKEND}/usuario/`, item)
      .pipe(map(data => data as any));
  }

}
