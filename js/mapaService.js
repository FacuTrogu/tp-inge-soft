const MapaService = (() => {
  let mapa = null;
  let marcadores = [];

  function inicializar(elementoId) {
    if (mapa) mapa.remove();
    mapa = L.map(elementoId).setView([-34.53, -58.70], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(mapa);
    return mapa;
  }

  function limpiarMarcadores() {
    marcadores.forEach((marcador) => mapa.removeLayer(marcador));
    marcadores = [];
  }

  function agregarMarcadorCharla(charla) {
    if (!mapa || !charla.sede || !charla.sede.lat || !charla.sede.lng) return null;
    
    const marcador = L.marker([charla.sede.lat, charla.sede.lng]).addTo(mapa);
    marcador.bindPopup(
      `<strong>${charla.nombre}</strong><br>` +
      `<em>${charla.tema}</em><br>` +
      `<b>Fecha:</b> ${formatearFecha(charla.fecha)} a las ${charla.horario} hs<br>` +
      `<b>Sede:</b> ${charla.sede.nombre}<br>` +
      `<b>Direccion:</b> ${charla.sede.direccion}`
    );
    marcadores.push(marcador);
    return marcador;
  }

  function mostrarTodasLasCharlas(charlas) {
    if (!mapa) return;
    limpiarMarcadores();
    charlas.forEach(agregarMarcadorCharla);
    if (marcadores.length) mapa.fitBounds(L.featureGroup(marcadores).getBounds().pad(0.2));
  }

  function centrarEnCharla(charla) {
    if (!mapa || !charla.sede) return;
    mapa.setView([charla.sede.lat, charla.sede.lng], 15);
    const marcador = marcadores.find((m) => {
      const posicion = m.getLatLng();
      return posicion.lat === charla.sede.lat && posicion.lng === charla.sede.lng;
    });
    if (marcador) marcador.openPopup();
  }

  function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  function refrescar() {
    if (mapa) setTimeout(() => mapa.invalidateSize(), 100);
  }

  return { inicializar, mostrarTodasLasCharlas, centrarEnCharla, refrescar };
})();