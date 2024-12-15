import axios from 'axios';

let handler = async (m, { conn, text, participants }) => {
    // Filtrar los participantes, excluyendo al creador y al bot
    const groupAdmins = participants.filter(p => p.admin);
    const botId = conn.user.jid;
    const groupOwner = groupAdmins.find(p => p.isAdmin)?.id;  // Encontrar el propietario del grupo
    const groupNoAdmins = participants.filter(p => p.id !== botId && p.id !== groupOwner && !p.admin).map(p => p.id);

    if (groupNoAdmins.length === 0) throw '*⚠️ No hay usuarios para eliminar.*'; // Verifica que haya usuarios para eliminar

    // URL del sticker que se enviará
    const stickerUrl = 'https://pomf2.lain.la/f/9wvscc1f.webp'; // URL del sticker

    // Enviar el sticker directamente desde la URL como respuesta al comando
    await conn.sendMessage(m.chat, { sticker: { url: stickerUrl }, quoted: m });

    // Eliminar a cada miembro con un retraso de 2 segundos
    for (let userId of groupNoAdmins) {
        await conn.groupParticipantsUpdate(m.chat, [userId], 'remove');
        await new Promise(resolve => setTimeout(resolve, 2000));  // Espera de 2 segundos entre eliminaciones
    }

     No enviamos mensaje adicional después de la eliminación
    // m.reply('*[🌠] Eliminación Exitosa.*');
}

handler.help = ['kickall', '-'].map(v => 'o' + v + ' @user');
handler.tags = ['owner'];
handler.command = /^(kickall)$/i;

handler.group = true;
handler.botAdmin = true;

export default handler;