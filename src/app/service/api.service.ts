import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private usuarioActual: any = null;

  // URL del backend
  private urlApi = 'http://localhost:8080/v3/alumnos';  
  private username: string = 'root';  // Almacena el nombre de usuario para Basic Auth
  private password: string = 'root123';  // Almacena la contraseña para Basic Auth

  constructor(private http: HttpClient) {}

  // Método para autenticar y obtener acceso usando Basic Authentication
  authenticate(username: string, password: string): Observable<any> {
    // Codifica las credenciales en base64
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
    console.log(authHeader);  // Verifica si la codificación es correcta

    // Realiza la solicitud GET con las credenciales de autenticación
    const headers = new HttpHeaders({
      'Authorization': authHeader  // Encabezado con las credenciales codificadas
    });

    return this.http.get(`${this.urlApi}`, { headers, observe: 'response' });
  }

  // Método para obtener los datos de alumnos
  getData(): Observable<any> {
    // Envío de la solicitud con el encabezado de autenticación básica
    const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;  // Usando las credenciales codificadas
    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.get(`${this.urlApi}`, { headers });
  }

  // Método para guardar las credenciales de autenticación
  setCredentials(username: string, password: string): void {
    this.username = username;
    this.password = password;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('usuario');  // Devuelve true si hay usuario
  }

  // Método para guardar los datos del usuario en el servicio
  setUsuarioActual(usuario: any): void {
    this.usuarioActual = usuario;
    sessionStorage.setItem('usuario', JSON.stringify(usuario));  // Guarda en sessionStorage
  }

  // Obtener los datos del usuario actual
  getUsuarioActual(): any {
    return this.usuarioActual || JSON.parse(sessionStorage.getItem('usuario') || '{}');
  }

  // Método para actualizar los datos del usuario
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    // Establecer los encabezados de autenticación
    const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader
    });

    return this.http.put(`${this.urlApi}/${id}`, usuario, { headers });
  }

  // Método para registrar un nuevo alumno
  registrarAlumno(alumno: any): Observable<any> {
    const authHeader = `Basic ${btoa(`${this.username}:${this.password}`)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader
    });

    return this.http.post(this.urlApi, alumno, { headers });
  }
}
