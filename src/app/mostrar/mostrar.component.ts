import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar',
  imports: [CommonModule, FormsModule],
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css'],
  standalone: true
})
export class MostrarComponent implements OnInit {
  alumnos: any[] = [];
  usuarioEditando: any = {}; // Inicializa con un objeto vacío para evitar el error de enlace bidireccional
  isModalOpen: boolean = false; // Propiedad para controlar la visibilidad del modal

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.authenticate('root', 'root123').subscribe(
      response => {
        this.apiService.setCredentials('root', 'root123');
        this.llenarData();
      },
      error => {
        console.error('Error de autenticación:', error);
        this.router.navigate(['/login']);
      }
    );
  }

  llenarData(): void {
    this.apiService.getData().subscribe(
      response => {
        if (response && response.alumnosResponse && response.alumnosResponse.alumnos) {
          this.alumnos = response.alumnosResponse.alumnos;
        }
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.router.navigate(['/login']);
      }
    );
  }

  editarUsuario(alumno: any): void {
    this.usuarioEditando = { ...alumno }; // Crear una copia del alumno para evitar cambios directos en los datos originales
    this.isModalOpen = true; // Abrir el modal
  }

  guardarCambios(): void {
    if (this.usuarioEditando) {
      this.apiService.actualizarUsuario(this.usuarioEditando.id_alumno, this.usuarioEditando).subscribe(
        response => {
          this.llenarData();
          this.isModalOpen = false; // Cerrar el modal
          this.usuarioEditando = {}; // Limpiar el objeto después de la edición
        },
        error => {
          console.error('Error al guardar los cambios:', error);
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.usuarioEditando = {}; // Limpiar el objeto de edición
    this.isModalOpen = false; // Cerrar el modal
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    this.apiService.setUsuarioActual(null);
    this.router.navigate(['/login']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuarioEditando.foto = e.target.result.split(',')[1]; // Extrae la imagen en base64
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
  }
}
