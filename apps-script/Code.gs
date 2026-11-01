/**
 * Rookie Coach · alta de la guía gratis.
 * Va pegado en la hoja de cálculo "Emails Rookie Coach" (Extensiones > Apps Script).
 * Cada vez que alguien pide la guía en la web:
 *   1) guarda fecha + email en la hoja,
 *   2) le manda la guía desde tu Gmail,
 *   3) te avisa a ti.
 */
const GUIA_URL = 'https://rookie-coach-six.vercel.app/guia-5-ejercicios-futbol8.pdf';
const WEB = 'https://rookie-coach-six.vercel.app';
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
      htmlBody: emailHtml()
    });
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Nuevo entrenador: ' + email,
      email + ' ha pedido la guía gratis. Ya tienes ' + (hoja.getLastRow() - 1) + ' emails en la hoja.');
  }
  return ContentService.createTextOutput('ok');
}

/** Elige "prueba" arriba y pulsa "Ejecutar": te manda el correo a ti para ver cómo queda (no toca la hoja). */
function prueba() {
  MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), name: 'Rookie Coach',
    subject: 'Tu guía gratis: 5 ejercicios de Fútbol 8 ⚽', htmlBody: emailHtml() });
}

/** Diseño del correo (colores Rookie Coach: azul noche + lima). */
function emailHtml() {
  const ej = [['Semáforo con balón','Activación'],['Duelo de números','1x1'],['El tercer hombre','Pase'],
              ['La bomba','Rondo'],['4 porterías','Toma de decisión']];
  const filas = ej.map((x, i) =>
    '<tr><td width="44" valign="middle" style="padding:7px 0">' +
      '<div style="width:32px;height:32px;line-height:32px;border-radius:16px;background:#C8FF2E;color:#0A0F1E;text-align:center;font-weight:900;font-size:15px">' + (i + 1) + '</div></td>' +
    '<td valign="middle" style="padding:7px 0;color:#FFFFFF;font-size:16px;font-weight:bold">' + x[0] +
      ' <span style="color:#9AA6C2;font-weight:normal;font-size:14px">· ' + x[1] + '</span></td></tr>').join('');
  return '' +
  '<div style="background:#070B16;margin:0;padding:0">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#070B16" style="background:#070B16">' +
  '<tr><td align="center" style="padding:24px 12px">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:Helvetica,Arial,sans-serif">' +

  // Cabecera con logo
  '<tr><td align="center" style="padding:0 0 8px"><img src="' + WEB + '/email/logo.png" width="300" alt="Rookie Coach" style="display:block;width:300px;max-width:80%;height:auto;border:0"></td></tr>' +

  // Tarjeta principal
  '<tr><td bgcolor="#121C36" style="background:#121C36;border-radius:20px;border:1px solid #2A3658;padding:32px 28px">' +
    '<div style="text-align:center"><span style="display:inline-block;background:#C8FF2E;color:#0A0F1E;font-weight:900;font-size:12px;letter-spacing:1px;padding:6px 14px;border-radius:999px">GUÍA GRATIS</span></div>' +
    '<h1 style="margin:16px 0 8px;text-align:center;color:#FFFFFF;font-size:30px;line-height:1.1;font-weight:900">¡Aquí tienes tu guía!</h1>' +
    '<p style="margin:0 0 24px;text-align:center;color:#C9D1E3;font-size:16px;line-height:1.5">5 ejercicios para tus entrenamientos de <b style="color:#C8FF2E">Fútbol 8</b>, explicados paso a paso, con imágenes y un vídeo con voz de cada uno.</p>' +
    '<div style="text-align:center"><a href="' + GUIA_URL + '"><img src="' + WEB + '/portada.jpg" width="220" alt="Portada de la guía" style="width:220px;max-width:70%;height:auto;border-radius:12px;border:0"></a></div>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 0">' + filas + '</table>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto 0"><tr>' +
      '<td bgcolor="#C8FF2E" style="background:#C8FF2E;border-radius:12px">' +
      '<a href="' + GUIA_URL + '" style="display:inline-block;padding:16px 30px;color:#0A0F1E;font-weight:900;font-size:17px;text-decoration:none">DESCARGAR LA GUÍA (PDF)</a></td></tr></table>' +
  '</td></tr>' +

  // TikTok
  '<tr><td align="center" style="padding:26px 16px 0;color:#FFFFFF;font-size:16px;line-height:1.5">' +
    '¿Quieres más ejercicios como estos?<br><b style="color:#C8FF2E">Sígueme en TikTok</b>: subo nuevos cada semana.</td></tr>' +
  '<tr><td align="center" style="padding:18px 16px 0;color:#FFFFFF;font-size:15px">Un saludo,<br><b>Rookie Coach</b></td></tr>' +

  // Pie
  '<tr><td align="center" style="padding:28px 16px 0;color:#6B7895;font-size:12px;line-height:1.5">' +
    'Recibes este correo porque pediste la guía en nuestra web.<br>Si no quieres recibir más, responde con "baja".</td></tr>' +
  '</table></td></tr></table></div>';
}
