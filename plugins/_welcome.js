import { WAMessageStubType } from '@adiwajshing/baileys';
import fetch from 'node-fetch';
import canvacard from 'canvacard';
import fs from 'fs';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://pomf2.lain.la/f/b03w5p5.jpg');
  let img = await (await fetch(`${pp}`)).buffer();
  let chat = global.db.data.chats[m.chat];

  // Generar la imagen de bienvenida/despedida usando canvacard
  const who = m.messageStubParameters[0];
  const background = m.messageStubType === 27 
    ? "https://pomf2.lain.la/f/ndkt6rw7.jpg"  // Fondo de bienvenida
    : "https://pomf2.lain.la/f/ndkt6rw7.jpg"; // Fondo de despedida (puedes personalizarlo)

  // Verifica o crea el directorio de salida
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output', { recursive: true });
  }

  // Configura la tarjeta
  const welcomer = new canvacard.WelcomeLeave()
    .setAvatar(pp)
    .setBackground('IMAGE', background)
    .setTitulo(m.messageStubType === 27 ? "NUEVO INGRESO AL GRUPO" : "USUARIO DESPEDIDO", '#FFFFFF')
    .setSubtitulo(m.messageStubType === 27 ? "Por favor leer las reglas del grupo" : "Gracias por ser parte del grupo", '#FFFFFF')
    .setOpacityOverlay(0.5) // Ajusta la transparencia del overlay
    .setColorCircle('#FFFFFF')
    .setColorOverlay('rgba(255, 255, 255, 0.5)'); // Overlay blanco semitransparente

  try {
    const buffer = await welcomer.build("Arial Bold"); // Cambia la fuente si es necesario
    const filePath = './output/WelcomeCard.png';

    // Guarda la imagen localmente
    fs.writeFileSync(filePath, buffer);

    // Verifica que el archivo exista
    if (!fs.existsSync(filePath)) {
      throw new Error("La tarjeta no se generó correctamente.");
    }

    // Enviar la imagen generada al grupo
    let text = '';
    if (chat.bienvenida && m.messageStubType == 27) {
      text = `*⭒─ׄ─ׅ─ׄ─⭒ \`ʙɪᴇɴᴠᴇɴɪᴅᴀ\` ⭒─ׄ─ׅ─ׄ─⭒*\n\n╭── ︿︿︿︿︿ *⭒ ⭒ ⭒ ⭒ ⭒ ⭒*\n┊:⁖֟⊱┈֟፝❥ *ᴡᴇʟᴄᴏᴍᴇ* :: @${m.messageStubParameters[0].split`@`[0]}\n┊:⁖֟⊱┈֟፝❥  ${groupMetadata.subject}\n╰─── ︶︶︶︶ ✰⃕  ⌇ *⭒ ⭒ ⭒*   ˚̩̥̩̥*̩̩͙✩`;
      await conn.sendMini(m.chat, 'titulowm2', 'titu', text, filePath, filePath, 'canal', 'estilo');
    }

    if (chat.bienvenida && m.messageStubType == 28) {
      text = `*⭒─ׄ─ׅ─ׄ─⭒ \`ᴀ ᴅ ɪ ᴏ ꜱ\` ⭒─ׄ─ׅ─ׄ─⭒*\n\n╭── ︿︿︿︿︿ *⭒ ⭒ ⭒ ⭒ ⭒ ⭒*\n┊:⁖֟⊱┈֟፝❥ *ʙ ʏ ᴇ* :: @${m.messageStubParameters[0].split`@`[0]}\n┊:⁖֟⊱┈֟፝❥   *ꜱ ᴀ ʏ ᴏ ɴ ᴀ ʀ ᴀ 👋*\n╰─── ︶︶︶︶ ✰⃕  ⌇ *⭒ ⭒ ⭒*   ˚̩̥̩̥*̩̩͙✩`;
      await conn.sendMini(m.chat, 'titulowm2', 'titu', text, filePath, filePath, 'canal', 'estilo');
    }

    if (chat.bienvenida && m.messageStubType == 32) {
      text = `*⭒─ׄ─ׅ─ׄ─⭒ \`ᴀ ᴅ ɪ ᴏ ꜱ\` ⭒─ׄ─ׅ─ׄ─⭒*\n\n╭── ︿︿︿︿︿ *⭒ ⭒ ⭒ ⭒ ⭒ ⭒*\n┊:⁖֟⊱┈֟፝❥ *ʙ ʏ ᴇ* :: @${m.messageStubParameters[0].split`@`[0]}\n┊:⁖֟⊱┈֟፝❥   *ꜱ ᴀ ʏ ᴏ ɴ ᴀ ʀ ᴀ 👋*\n╰─── ︶︶︶︶ ✰⃕  ⌇ *⭒ ⭒ ⭒*   ˚̩̥̩̥*̩̩͙✩`;
      await conn.sendMini(m.chat, 'titulowm2', 'titu', text, filePath, filePath, 'canal', 'estilo');
    }
  } catch (err) {
    console.error("Error al generar la tarjeta:", err);
  }
}
