import { useState } from 'react';
import { cursosOpciones } from '../data/cursos';
import { site } from '../data/site';

const WA_NUMBER = '5217776310187';

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};
const capStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 15,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(244,239,230,.55)',
};
const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(244,239,230,.28)',
  color: '#f4efe6',
  fontFamily: "'Archivo', sans-serif",
  fontSize: 21,
  padding: '10px 0',
  outline: 'none',
};

/**
 * Formulario de captación de leads. Compone un mensaje con los datos y lo
 * envía por WhatsApp (canal real de CEIC). Más adelante se puede añadir
 * envío por correo (Web3Forms / Resend) sin cambiar la UI.
 */
/**
 * Clave de Web3Forms (gratis, sin backend). Si está definida en .env como
 * PUBLIC_WEB3FORMS_KEY, cada solicitud también llega por CORREO y queda
 * registrada. Si no está, el formulario sigue funcionando por WhatsApp.
 */
const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = String(f.get('nombre') || '').trim();
    const telefono = String(f.get('telefono') || '').trim();
    const email = String(f.get('email') || '').trim();
    const curso = String(f.get('curso') || '').trim();
    const mensaje = String(f.get('mensaje') || '').trim();

    const texto =
      `Hola CEIC, quiero informes.\n` +
      `• Nombre: ${nombre}\n` +
      `• Curso de interés: ${curso}\n` +
      (telefono ? `• Teléfono: ${telefono}\n` : '') +
      `• Email: ${email}` +
      (mensaje ? `\n• Mensaje: ${mensaje}` : '');

    // 1) Correo (si está configurado): deja registro del lead aunque el
    //    prospecto no tenga WhatsApp a la mano.
    if (WEB3FORMS_KEY) {
      setSending(true);
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Nueva solicitud de informes — ${curso}`,
            from_name: 'Sitio CEIC',
            nombre,
            email,
            telefono,
            curso,
            mensaje,
          }),
        });
      } catch {
        /* si falla el correo, seguimos con WhatsApp igual */
      }
      setSending(false);
    }

    // 2) WhatsApp: canal principal de CEIC.
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener'
    );
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 22 }}>
      <div
        className="ceic-fields"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}
      >
        <label style={labelStyle}>
          <span style={capStyle}>Nombre</span>
          <input required name="nombre" placeholder="Tu nombre" className="ceic-input" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={capStyle}>Teléfono</span>
          <input name="telefono" placeholder="+52" className="ceic-input" style={inputStyle} />
        </label>
      </div>
      <label style={labelStyle}>
        <span style={capStyle}>Email</span>
        <input required type="email" name="email" placeholder="tu@correo.com" className="ceic-input" style={inputStyle} />
      </label>
      <label style={labelStyle}>
        <span style={capStyle}>Curso de interés</span>
        <select name="curso" className="ceic-input" style={inputStyle} defaultValue={cursosOpciones[0]}>
          {cursosOpciones.map((c) => (
            <option key={c} value={c} style={{ background: '#0a0908' }}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label style={labelStyle}>
        <span style={capStyle}>Mensaje</span>
        <textarea
          name="mensaje"
          rows={3}
          placeholder="Cuéntanos qué quieres filmar"
          className="ceic-input"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
        <button
          type="submit"
          className="ceic-submit"
          disabled={sent || sending}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 17,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#0d0c0b',
            background: sent ? '#25d366' : '#d8a24a',
            border: 'none',
            padding: '16px 32px',
            borderRadius: 2,
            cursor: sent ? 'default' : 'pointer',
            fontWeight: 700,
          }}
        >
          {sent ? '✓ Solicitud enviada' : sending ? 'Enviando…' : 'Enviar solicitud'}
        </button>
        <a
          href={site.whatsapp.link}
          target="_blank"
          rel="noopener"
          className="ceic-btn-outline"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 17,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#f4efe6',
            border: '1px solid rgba(244,239,230,.4)',
            padding: '16px 32px',
            borderRadius: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          WhatsApp
        </a>
      </div>
    </form>
  );
}
