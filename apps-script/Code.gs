/**
 * Rookie Coach · alta de la guía gratis.
 * Va pegado en la hoja de cálculo "Emails Rookie Coach" (Extensiones > Apps Script).
 * Cada vez que alguien pide la guía en la web:
 *   1) guarda fecha + email en la hoja,
 *   2) le manda la guía desde tu Gmail,
 *   3) te avisa a ti.
 */
const GUIA_URL = 'https://rookie-coach-six.vercel.app/guia-5-ejercicios-futbol8.pdf';
const TIKTOK = 'https://www.tiktok.com/';   // cambia por el enlace de tu perfil si quieres

function doPost(e) {
  const email = String((e.parameter && e.parameter.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ContentService.createTextOutput('email no valido');

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (hoja.getLastRow() === 0) hoja.appendRow(['Fecha', 'Email', 'Origen']);
  const yaEsta = hoja.getRange(1, 2, hoja.getLastRow(), 1).getValues().some(r => r[0] === email);
  hoja.appendRow([new Date(), email, (e.parameter.origen || 'guia-5-ejercicios')]);

  if (!yaEsta) {
    MailApp.sendEmail({
      to: email,
      name: 'Rookie Coach',
      subject: 'Tu guía gratis: 5 ejercicios de Fútbol 8 ⚽',
      htmlBody:
        '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0A0F1E">' +
        '<h2 style="margin:0 0 12px">¡Aquí tienes tu guía! ⚽</h2>' +
        '<p>Gracias por apuntarte. Son 5 ejercicios de Fútbol 8 explicados paso a paso, con imágenes y un vídeo de cada uno.</p>' +
        '<p style="margin:24px 0"><a href="' + GUIA_URL + '" style="background:#C8FF2E;color:#0A0F1E;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold">Descargar la guía (PDF)</a></p>' +
        '<p>Si quieres más ejercicios como estos, sígueme en TikTok: subo nuevos cada semana.</p>' +
        '<p>Un saludo,<br><b>Rookie Coach</b></p>' +
        '<p style="color:#888;font-size:12px">Recibes este correo porque pediste la guía en nuestra web. Si no quieres recibir más, responde con "baja".</p>' +
        '</div>'
    });
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Nuevo entrenador: ' + email,
      email + ' ha pedido la guía gratis. Ya tienes ' + (hoja.getLastRow() - 1) + ' emails en la hoja.');
  }
  return ContentService.createTextOutput('ok');
}

/** Pulsa "Ejecutar" con esta función una vez para dar permisos y probar el envío a tu propio correo. */
function prueba() {
  doPost({ parameter: { email: Session.getEffectiveUser().getEmail(), origen: 'prueba' } });
}
