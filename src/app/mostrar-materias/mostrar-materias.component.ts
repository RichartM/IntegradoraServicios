import { Component } from '@angular/core';
import { ApiMateriaService } from '../service/api-materia.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar-materias',
  imports: [CommonModule,FormsModule],
  templateUrl: './mostrar-materias.component.html',
  styleUrl: './mostrar-materias.component.css',
  standalone: true
})
export class MostrarMateriasComponent {
  materias: any[] = [];
  usuarioActual: any;
  materiaActual: any = {}; // Grupo seleccionado para la edición
  modoEdicion: boolean = false; // Modo de edición

  constructor(private apiService: ApiMateriaService,private router:Router) {}

  ngOnInit(): void {
    this.apiService.authenticate('root', 'root123').subscribe(
      response => {
        console.log("Respuesta del servidor de autenticación:", response);
        this.apiService.setCredentials('root', 'root123');
      
        console.log("datos cargados :D");
        this.llenarData();  
      },
      error => {
        console.error('Error de autenticación:', error);
      }
    );

    if (!this.apiService.isAuthenticated()) {
      console.log('Sesión no iniciada. Redirigiendo al login...');
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return;
    }else{
        console.log("Sesion inciada");
        this.usuarioActual = this.apiService.getUsuarioActual();
        console.log('Datos del usuario actual:', this.usuarioActual);
    }

   console.log("datos cargados");
   console.log('Estructura de los grupos:', this.materias);
  }
  
  llenarData(): void {
    this.apiService.getData().subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        if (response && response.materiaResponse && response.materiaResponse.materias) {
          this.materias = response.materiaResponse.materias;
          console.log('grupos cargados:', this.materias);
          
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
        }

      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.router.navigate(['/login']); // Redirigir si hay un error al obtener los datos
      }
    );
  }

   // Este método se llama cuando el usuario selecciona un grupo para editar
   seleccionarMateria(materia: any): void {
    this.materiaActual = { ...materia }; // Clonamos los datos del grupo para no modificar el original
    this.modoEdicion = true; // Activamos el modo edición
    console.log('Grupo seleccionado para edición:', this.materiaActual);
  }

  // Este método guarda los cambios realizados en un grupo
  guardarCambios(): void {
    if (this.materiaActual && this.materiaActual.idMateria) {
      const id = this.materiaActual.idMateria; // Obtenemos el ID del grupo
      this.apiService.actualizarMateria(id, this.materiaActual).subscribe(
        (response) => {
          console.log('Grupo actualizado con éxito:', response);
          // Actualizamos la lista local de grupos con el grupo modificado
          const index = this.materias.findIndex((m) => m.idMateria === id);
          if (index !== -1) {
            this.materias[index] = { ...this.materiaActual };
          }
          alert('¡Cambios guardados con éxito!'); // Alerta al usuario
          this.modoEdicion = false; // Salimos del modo edición
        },
        (error) => {
          console.error('Error al actualizar el materia:', error);
          alert('Error al guardar los cambios. Intente nuevamente.');
        }
      );
    } else {
      console.warn('No hay materia seleccionado o faltan datos');
    }
  }

  // Este método cancela la edición y resetea el formulario
  cancelarEdicion(): void {
    this.materiaActual = {}; // Limpia el modelo del grupo seleccionado
    this.modoEdicion = false; // Salimos del modo edición
    console.log('Edición cancelada');
  }
  
  
  cerrarSesion(): void {
    sessionStorage.removeItem('usuario'); // Elimina los datos del usuario
    this.apiService.setUsuarioActual(null); // Limpia la sesión en el servicio
    console.log('Sesión cerrada');
    this.router.navigate(['/login']); // Redirige al login
  }
}
