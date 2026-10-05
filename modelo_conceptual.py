import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch

fig, ax = plt.subplots(1, 1, figsize=(22, 16))
ax.set_xlim(0, 22)
ax.set_ylim(0, 16)
ax.axis('off')
ax.set_aspect('equal')
fig.patch.set_facecolor('white')

def draw_entity(ax, x, y, name, attrs, w=3.6, pk=1):
    h_title = 0.5
    h_attr = len(attrs) * 0.35 + 0.2
    h = h_title + h_attr
    # Title box
    title_box = FancyBboxPatch((x - w/2, y - h_title), w, h_title,
        boxstyle="square,pad=0", facecolor='#1a5276', edgecolor='#1a5276', linewidth=1.5)
    ax.add_patch(title_box)
    ax.text(x, y - h_title/2, name, fontsize=11, fontweight='bold', ha='center', va='center', color='white')
    # Attrs box
    attr_box = FancyBboxPatch((x - w/2, y - h_title - h_attr), w, h_attr,
        boxstyle="square,pad=0", facecolor='#eaf2f8', edgecolor='#1a5276', linewidth=1.5)
    ax.add_patch(attr_box)
    for i, attr in enumerate(attrs):
        yy = y - h_title - 0.15 - i * 0.35
        prefix = "🔑 " if i < pk else "    "
        ax.text(x - w/2 + 0.15, yy, f"{prefix}{attr}", fontsize=8, ha='left', va='top', color='#2c3e50',
                fontfamily='monospace')
    return (x, y - h_title - h_attr/2, x - w/2, x + w/2, y, y - h_title - h_attr)

def draw_relation_line(ax, x1, y1, x2, y2, label1, label2, label_mid=None):
    ax.plot([x1, x2], [y1, y2], '-', color='#5d6d7e', linewidth=1.5)
    # Cardinalities
    dx = x2 - x1
    dy = y2 - y1
    dist = (dx**2 + dy**2)**0.5
    if dist > 0:
        ox, oy = -dy/dist * 0.2, dx/dist * 0.2
        ax.text(x1 + dx*0.12 + ox, y1 + dy*0.12 + oy, label1, fontsize=9, fontweight='bold',
                ha='center', va='center', color='#e74c3c')
        ax.text(x2 - dx*0.12 + ox, y2 - dy*0.12 + oy, label2, fontsize=9, fontweight='bold',
                ha='center', va='center', color='#e74c3c')
    if label_mid:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx + ox*1.5, my + oy*1.5, label_mid, fontsize=8, ha='center', va='center',
                color='#5d6d7e', style='italic')

# Title
ax.text(11, 15.5, 'Modelo Conceptual - Portal para Autoridades de Mesa', fontsize=16,
        fontweight='bold', ha='center', va='center', color='#1a5276')
ax.text(11, 15.0, 'Diagrama de Dominio', fontsize=12, ha='center', va='center', color='#5d6d7e')

# Entities
e_conv = draw_entity(ax, 4, 14, 'Convocatoria', [
    'id: Integer', 'fechaInicio: Date', 'fechaCierre: Date', 'estado: String'
], w=3.8)

e_charla = draw_entity(ax, 11, 14, 'Charla', [
    'id: Integer', 'nombre: String(200)', 'tema: String(500)',
    'fecha: Date', 'horario: Time'
], w=3.8)

e_sede = draw_entity(ax, 18, 14, 'Sede', [
    'id: Integer', 'nombre: String(200)', 'direccion: String(300)',
    'latitud: Float', 'longitud: Float'
], w=3.8)

e_post = draw_entity(ax, 5, 8.5, 'Postulante', [
    'id: Integer', 'nombre: String(100)', 'apellido: String(100)',
    'dni: String(8)', 'fechaNacimiento: Date', 'direccion: String(300)',
    'telefono: String(15)', 'email: String(200)',
    'fueAutoridad: Boolean', 'cumplioCapacitacion: Boolean',
    'esAfiliado: Boolean', 'partido: String(200)',
    'estado: String', 'motivoRechazo: String(500)',
    'fechaInscripcion: DateTime'
], w=4.2)

e_distrito = draw_entity(ax, 14, 8, 'DistritoElectoral', [
    'id: Integer', 'nombre: String(100)', 'provincia: String(100)'
], w=3.8)

e_admin = draw_entity(ax, 19, 8.5, 'Administrador', [
    'id: Integer', 'nombre: String(100)', 'email: String(200)'
], w=3.6)

e_interes = draw_entity(ax, 11, 4.5, 'InteresCharla', [
    'id: Integer', 'postulante_id: FK', 'charla_id: FK',
    'fechaRegistro: DateTime'
], w=3.8)

# Relations
# Convocatoria 1---N Charla
ax.annotate('', xy=(9.1, 13.2), xytext=(5.9, 13.2),
            arrowprops=dict(arrowstyle='->', color='#5d6d7e', lw=1.5))
ax.text(7.5, 13.5, 'incluye', fontsize=9, ha='center', color='#5d6d7e', style='italic')
ax.text(6.1, 13.0, '1', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(8.9, 13.0, 'N', fontsize=10, fontweight='bold', color='#e74c3c')

# Charla N---1 Sede
ax.annotate('', xy=(16.1, 13.2), xytext=(12.9, 13.2),
            arrowprops=dict(arrowstyle='->', color='#5d6d7e', lw=1.5))
ax.text(14.5, 13.5, 'se realiza en', fontsize=9, ha='center', color='#5d6d7e', style='italic')
ax.text(13.1, 13.0, 'N', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(15.9, 13.0, '1', fontsize=10, fontweight='bold', color='#e74c3c')

# Postulante N---1 DistritoElectoral
ax.annotate('', xy=(12.1, 7.5), xytext=(7.1, 7.5),
            arrowprops=dict(arrowstyle='->', color='#5d6d7e', lw=1.5))
ax.text(9.6, 7.8, 'pertenece a', fontsize=9, ha='center', color='#5d6d7e', style='italic')
ax.text(7.3, 7.3, 'N', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(11.9, 7.3, '1', fontsize=10, fontweight='bold', color='#e74c3c')

# Postulante 1---N InteresCharla
ax.plot([5, 9.1], [3.2, 4.0], '-', color='#5d6d7e', linewidth=1.5)
ax.text(6.5, 3.9, '1', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(8.8, 4.1, 'N', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(6.8, 3.3, 'registra interés', fontsize=9, ha='center', color='#5d6d7e', style='italic')

# Charla 1---N InteresCharla
ax.plot([11, 11], [11.15, 5.4], '-', color='#5d6d7e', linewidth=1.5)
ax.text(11.3, 10.8, '1', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(11.3, 5.6, 'N', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(11.8, 8.2, 'es de interés en', fontsize=9, ha='center', color='#5d6d7e', style='italic', rotation=90)

# Administrador gestiona Convocatoria
ax.plot([17.2, 5.9], [8.5, 13.5], '--', color='#95a5a6', linewidth=1.2)
ax.text(12, 11.5, 'gestiona', fontsize=9, ha='center', color='#95a5a6', style='italic')

# Postulante se inscribe en Convocatoria
ax.plot([4.5, 4], [10.5, 12.1], '-', color='#5d6d7e', linewidth=1.5)
ax.text(3.5, 11.3, 'se inscribe en', fontsize=9, ha='center', color='#5d6d7e', style='italic', rotation=80)
ax.text(4.7, 10.7, 'N', fontsize=10, fontweight='bold', color='#e74c3c')
ax.text(3.8, 12.0, '1', fontsize=10, fontweight='bold', color='#e74c3c')

# Legend
legend_y = 1.5
ax.add_patch(FancyBboxPatch((0.5, 0.3), 6, 1.8, boxstyle="round,pad=0.1",
    facecolor='#fafafa', edgecolor='#bdc3c7', linewidth=1))
ax.text(3.5, 1.85, 'Leyenda', fontsize=10, fontweight='bold', ha='center', color='#2c3e50')
ax.text(1, 1.3, '🔑  = Clave primaria', fontsize=8, ha='left', color='#2c3e50')
ax.text(1, 0.85, 'FK = Clave foránea', fontsize=8, ha='left', color='#2c3e50')
ax.text(3.5, 1.3, '1───N  Uno a muchos', fontsize=8, ha='left', color='#2c3e50')
ax.text(3.5, 0.85, '- - -  Relación de gestión', fontsize=8, ha='left', color='#95a5a6')

plt.tight_layout()
plt.savefig('/home/user/output/Modelo_Conceptual.png', dpi=150, bbox_inches='tight', facecolor='white')
print("Diagrama de modelo conceptual generado")
