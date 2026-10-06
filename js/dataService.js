const DataService = (() => {
  const STORAGE_KEYS = {
    CHARLAS: "portal_charlas",
    POSTULANTES: "portal_postulantes",
    DISTRITOS: "portal_distritos",
  };

  async function cargarJSON(ruta) {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error("Error al cargar " + ruta);
    return respuesta.json();
  }

async function inicializar() {
    if (!localStorage.getItem(STORAGE_KEYS.CHARLAS)) {
      const charlas = await cargarJSON("data/charlas.json");
      localStorage.setItem(STORAGE_KEYS.CHARLAS, JSON.stringify(charlas));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DISTRITOS)) {
      const distritos = await cargarJSON("data/distritos.json");
      localStorage.setItem(STORAGE_KEYS.DISTRITOS, JSON.stringify(distritos));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTULANTES)) {
      const postulantes = await cargarJSON("data/postulantes.json");
      localStorage.setItem(STORAGE_KEYS.POSTULANTES, JSON.stringify(postulantes));
    }
  }

  function obtenerCharlas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARLAS) || "[]");
  }

  function obtenerDistritos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISTRITOS) || "[]");
  }

  function obtenerPostulantes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTULANTES) || "[]");
  }

  function existePostulantePorDNI(dni) {
    return obtenerPostulantes().some((p) => p.dni === dni);
  }

  function guardarPostulante(postulante) {
    const lista = obtenerPostulantes();
    postulante.id = lista.length > 0 ? Math.max(...lista.map((p) => p.id)) + 1 : 1;
    postulante.estado = "Pendiente";
    postulante.fechaInscripcion = new Date().toISOString();
    lista.push(postulante);
    localStorage.setItem(STORAGE_KEYS.POSTULANTES, JSON.stringify(lista));
    return postulante;
  }

  return {
    inicializar,
    obtenerCharlas,
    obtenerDistritos,
    obtenerPostulantes,
    existePostulantePorDNI,
    guardarPostulante,
  };
})();