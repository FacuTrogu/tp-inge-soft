/**
 * validacion.js
 * Reglas de validacion del formulario de inscripcion.
 * Separa la logica de negocio de la presentacion.
 */

const Validacion = (() => {
  function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function esTelefonoValido(telefono) {
    return /^\d{10,15}$/.test(telefono);
  }

  function esDNIValido(dni) {
    return /^\d{7,8}$/.test(dni);
  }

  function esMayorDeEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
    if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  }

  /**
   * Valida todos los campos del formulario.
   * Retorna un objeto { valido: boolean, errores: { campo: mensaje } }
   */
  function validarFormularioPostulante(datos) {
    const errores = {};

    if (!datos.distrito) errores.distrito = "Debe seleccionar un distrito electoral.";
    if (!datos.nombre || datos.nombre.trim().length === 0) errores.nombre = "El nombre es obligatorio.";
    if (!datos.apellido || datos.apellido.trim().length === 0) errores.apellido = "El apellido es obligatorio.";

    if (!datos.dni) {
      errores.dni = "El DNI es obligatorio.";
    } else if (!esDNIValido(datos.dni)) {
      errores.dni = "El DNI debe tener 7 u 8 digitos numericos.";
    } else if (DataService.existePostulantePorDNI(datos.dni)) {
      errores.dni = "Ya existe una postulacion con ese DNI.";
    }

    if (!datos.fechaNacimiento) {
      errores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else if (!esMayorDeEdad(datos.fechaNacimiento)) {
      errores.fechaNacimiento = "Debe ser mayor de 18 anios.";
    }

    if (!datos.direccion || datos.direccion.trim().length === 0) errores.direccion = "La direccion es obligatoria.";

    if (!datos.telefono) {
      errores.telefono = "El telefono es obligatorio.";
    } else if (!esTelefonoValido(datos.telefono)) {
      errores.telefono = "El telefono debe tener entre 10 y 15 digitos.";
    }

    if (!datos.email) {
      errores.email = "El email es obligatorio.";
    } else if (!esEmailValido(datos.email)) {
      errores.email = "El formato de email no es valido.";
    }

    if (datos.fueAutoridad === undefined || datos.fueAutoridad === null) {
      errores.fueAutoridad = "Debe indicar si fue autoridad previamente.";
    }
    if (datos.cumplioCapacitacion === undefined || datos.cumplioCapacitacion === null) {
      errores.cumplioCapacitacion = "Debe indicar si cumplio la capacitacion.";
    }
    if (datos.esAfiliado === undefined || datos.esAfiliado === null) {
      errores.esAfiliado = "Debe indicar si es afiliado.";
    }
    if (datos.esAfiliado === true && (!datos.partido || datos.partido.trim().length === 0)) {
      errores.partido = "Debe indicar el nombre del partido.";
    }

    return {
      valido: Object.keys(errores).length === 0,
      errores,
    };
  }

  return { validarFormularioPostulante };
})();
