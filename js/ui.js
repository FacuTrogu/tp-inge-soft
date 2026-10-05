/**
 * ui.js
 * Capa de presentacion. Maneja el DOM, la navegacion entre vistas
 * y la interaccion con el usuario. Utiliza DataService, Validacion y MapaService.
 */

const UI = (() => {
  let mapaInicializado = false;

  function inicializar() {
    configurarNavegacion();
    renderizarCharlas();
    renderizarFormulario();
    renderizarPostulaciones();
    mostrarPagina(localStorage.getItem("portal_pagina_activa") || "charlas");
  }

  /* === Navegacion === */
  function mostrarPagina(nombre) {
    localStorage.setItem("portal_pagina_activa", nombre);
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll(".navbar nav button").forEach((b) => b.classList.remove("active"));
    const pagina = document.getElementById("page-" + nombre);
    if (pagina) pagina.classList.add("active");
    const boton = document.getElementById("nav-" + nombre);
    if (boton) boton.classList.add("active");

    if (nombre === "charlas" && !mapaInicializado) {
      setTimeout(() => {
        MapaService.inicializar("mapa-charlas");
        MapaService.mostrarTodasLasCharlas(DataService.obtenerCharlas());
        mapaInicializado = true;
      }, 150);
    }
    if (nombre === "charlas" && mapaInicializado) {
      MapaService.refrescar();
    }
    if (nombre === "postulaciones") {
      renderizarPostulaciones();
    }
  }

  function configurarNavegacion() {
    document.getElementById("nav-charlas").addEventListener("click", () => mostrarPagina("charlas"));
    document.getElementById("nav-inscripcion").addEventListener("click", () => mostrarPagina("inscripcion"));
    document.getElementById("nav-postulaciones").addEventListener("click", () => mostrarPagina("postulaciones"));
  }

  /* === Charlas === */
  function renderizarCharlas() {
    const charlas = DataService.obtenerCharlas();
    const contenedor = document.getElementById("lista-charlas");
    contenedor.innerHTML = "";
    charlas.forEach((charla) => {
      const fechaFormateada = formatearFecha(charla.fecha);
      const div = document.createElement("div");
      div.className = "charla-card";
      div.innerHTML = `
        <div class="charla-info">
          <h4>${charla.nombre}</h4>
          <div class="charla-meta">
            <span>&#128197; ${fechaFormateada}</span>
            <span>&#128336; ${charla.horario} hs</span>
            <span>&#127963; ${charla.sede.nombre}</span>
          </div>
          <p class="charla-tema">${charla.tema}</p>
          <p class="charla-sede">&#128205; ${charla.sede.direccion}</p>
        </div>
        <div class="charla-map-btn">
          <button class="btn btn-primary" data-charla-id="${charla.id}">Ver en mapa</button>
        </div>
      `;
      contenedor.appendChild(div);
    });

    contenedor.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-charla-id]");
      if (!boton) return;
      const id = parseInt(boton.dataset.charlaId, 10);
      const charla = charlas.find((c) => c.id === id);
      if (charla) {
        document.getElementById("mapa-charlas").scrollIntoView({ behavior: "smooth" });
        MapaService.centrarEnCharla(charla);
      }
    });
  }

  /* === Formulario de inscripcion === */
  function renderizarFormulario() {
    const selectDistrito = document.getElementById("campo-distrito");
    const distritos = DataService.obtenerDistritos();
    distritos.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.nombre + " (" + d.provincia + ")";
      selectDistrito.appendChild(opt);
    });

    const charlasContainer = document.getElementById("charlas-interes");
    const charlas = DataService.obtenerCharlas();
    charlas.forEach((c) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" name="interes_charla" value="${c.id}"> ${c.nombre} (${formatearFecha(c.fecha)})`;
      charlasContainer.appendChild(label);
    });

    const radioAfiliado = document.querySelectorAll('input[name="esAfiliado"]');
    radioAfiliado.forEach((r) => {
      r.addEventListener("change", actualizarVisibilidadPartido);
    });

    const form = document.getElementById("form-inscripcion");
    form.addEventListener("submit", procesarInscripcion);
    form.addEventListener("reset", () => {
      setTimeout(() => {
        limpiarErrores();
        actualizarVisibilidadPartido();
      }, 0);
    });
  }

  function actualizarVisibilidadPartido() {
    const grupoPartido = document.getElementById("grupo-partido");
    const seleccionado = document.querySelector('input[name="esAfiliado"]:checked');
    grupoPartido.style.display = seleccionado && seleccionado.value === "true" ? "flex" : "none";
  }

  function procesarInscripcion(evento) {
    evento.preventDefault();
    limpiarErrores();

    const datos = recogerDatosFormulario();
    const resultado = Validacion.validarFormularioPostulante(datos);

    if (!resultado.valido) {
      mostrarErrores(resultado.errores);
      mostrarToast("Por favor, corrija los errores del formulario.", "error");
      return;
    }

    DataService.guardarPostulante(datos);
    mostrarToast("Inscripcion registrada exitosamente. Su postulacion quedo en estado Pendiente.", "success");
    document.getElementById("form-inscripcion").reset();
    actualizarVisibilidadPartido();
    renderizarPostulaciones();
  }

  function recogerDatosFormulario() {
    const getVal = (id) => document.getElementById(id)?.value?.trim() || "";
    const getRadio = (name) => {
      const seleccionado = document.querySelector(`input[name="${name}"]:checked`);
      if (!seleccionado) return null;
      return seleccionado.value === "true";
    };
    const charlasSeleccionadas = [];
    document.querySelectorAll('input[name="interes_charla"]:checked').forEach((cb) => {
      charlasSeleccionadas.push(parseInt(cb.value, 10));
    });

    return {
      distrito: getVal("campo-distrito"),
      nombre: getVal("campo-nombre"),
      apellido: getVal("campo-apellido"),
      dni: getVal("campo-dni"),
      fechaNacimiento: getVal("campo-fecha-nac"),
      direccion: getVal("campo-direccion"),
      telefono: getVal("campo-telefono"),
      email: getVal("campo-email"),
      fueAutoridad: getRadio("fueAutoridad"),
      cumplioCapacitacion: getRadio("cumplioCapacitacion"),
      esAfiliado: getRadio("esAfiliado"),
      partido: getVal("campo-partido"),
      charlasInteres: charlasSeleccionadas,
    };
  }

  /* === Postulaciones === */
  function renderizarPostulaciones() {
    const contenedor = document.getElementById("lista-postulaciones");
    const postulantes = DataService.obtenerPostulantes();
    const distritos = DataService.obtenerDistritos();

    if (postulantes.length === 0) {
      contenedor.innerHTML = '<p class="empty-state">Aun no hay postulaciones registradas en este navegador.</p>';
      return;
    }

    const filas = postulantes
      .slice()
      .reverse()
      .map((p) => {
        const distrito = distritos.find((d) => String(d.id) === String(p.distrito));
        const nombreDistrito = distrito ? distrito.nombre : p.distrito;
        const fecha = p.fechaInscripcion ? formatearFechaHora(p.fechaInscripcion) : "-";
        return `<tr>
          <td>${p.dni}</td>
          <td>${p.apellido}, ${p.nombre}</td>
          <td>${nombreDistrito}</td>
          <td>${p.email}</td>
          <td><span class="badge">${p.estado || "Pendiente"}</span></td>
          <td>${fecha}</td>
        </tr>`;
      })
      .join("");

    contenedor.innerHTML = `
      <div class="table-wrap">
        <table class="tabla-postulaciones">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Apellido y nombre</th>
              <th>Distrito</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Fecha de inscripcion</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
    `;
  }

  /* === Errores === */
  function mostrarErrores(errores) {
    for (const [campo, mensaje] of Object.entries(errores)) {
      const errorEl = document.getElementById("error-" + campo);
      if (errorEl) errorEl.textContent = mensaje;
      const inputEl = document.getElementById("campo-" + campo);
      if (inputEl) inputEl.classList.add("error");
    }
    const primerError = document.querySelector(".error");
    if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function limpiarErrores() {
    document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
  }

  /* === Toast === */
  function mostrarToast(mensaje, tipo) {
    const contenedor = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast " + tipo;
    toast.textContent = mensaje;
    contenedor.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function formatearFecha(fechaStr) {
    const partes = fechaStr.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function formatearFechaHora(isoStr) {
    const fecha = new Date(isoStr);
    if (Number.isNaN(fecha.getTime())) return isoStr;
    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const yyyy = fecha.getFullYear();
    const hh = String(fecha.getHours()).padStart(2, "0");
    const min = String(fecha.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  return { inicializar };
})();
