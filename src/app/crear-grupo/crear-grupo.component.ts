import { Component } from '@angular/core';
import { ApiGruposService } from '../service/api-grupos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Aquí importamos FormsModule

@Component({
  selector: 'app-crear-grupo',
  imports: [CommonModule, FormsModule],  // Asegúrate de solo importar FormsModule aquí
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.css'],  // Corregí 'styleUrl' a 'styleUrls'
  standalone: true
})
export class CrearGrupoComponent {

  // Cambiar el modelo para solo registrar el grupo
  nuevoGrupo: any = {  // Valor predeterminado
    grado: 0,
    grupo: '',
    carrera: '',
    estado: true
  };

  constructor(private apiService: ApiGruposService, private router: Router) {}

  ngOnInit(): void {
    // Aquí sigue la validación de autenticación si es necesario
    if (!this.apiService.isAuthenticated()) {
      console.log('Sesión no iniciada. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    } else {
      console.log('Sesión iniciada correctamente.');
    }
  }

  // Cambiar el método para registrar un grupo
  registrarGrupo(): void {
    console.log('Datos del grupo a enviar:', this.nuevoGrupo);
    this.apiService.registrarGrupo(this.nuevoGrupo).subscribe({
      next: (response) => {
        console.log('Grupo registrado con éxito:', response);
        alert('Grupo registrado correctamente');
      },
      error: (error) => {
        console.error('Error al registrar el grupo:', error);
        alert('Error al registrar el grupo');
      }
    });
  }

  // Cambiar la función de imagen, si es necesario (puedes omitirla si no se necesita)
  procesarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const trimmedBase64 = base64.substring(base64.indexOf(',') + 1); // Quitamos el prefijo
        console.log('Base64 recortado:', trimmedBase64);
      };
      reader.readAsDataURL(file); // Leemos el archivo como Data URL
    } else {
      console.log('No se seleccionó ningún archivo');
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    this.apiService.setUsuarioActual(null);
    console.log('Sesión cerrada');
    this.router.navigate(['/login']);
  }

}
