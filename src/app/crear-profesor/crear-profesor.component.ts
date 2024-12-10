import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiProfesorService } from '../service/api-profesor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-profesor',
  imports: [CommonModule,FormsModule],
  templateUrl: './crear-profesor.component.html',
  styleUrl: './crear-profesor.component.css',
  standalone:true
})
export class CrearProfesorComponent {

  // Cambiar el modelo para solo registrar el grupo
  nuevoDocente: any = {  // Valor predeterminado
    primerNombre:'',
    segundoNombre:'',
    primerApellido:'',
    segundoApellido:'',
    correo:'',
    password:'',
    sexo:'',
    estado: true,
    grupos: {
      id_grupo: 0
    },
    materias: {
      idMateria:0
    }
  };

  constructor(private apiService: ApiProfesorService, private router: Router) {}

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
  registrarProfesor(): void {
    console.log('Datos del grupo a enviar:', this.nuevoDocente);
    this.apiService.registrarDocente(this.nuevoDocente).subscribe({
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
