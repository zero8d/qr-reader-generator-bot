import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../.env') })
console.log(__dirname)
import { Bot, InlineKeyboard, InputFile, Keyboard } from 'grammy'
import jimp from 'jimp'
import jsQR from 'jsqr'
import QRCode from 'qrcode'
const token = process.env.BOT_TOKEN || ''
const bot = new Bot(token)

bot.command('start', ctx => {
  const keyboard = new Keyboard()
  keyboard.webApp('Read code', 'https://qrgr.zapi.uz/readandsend.html')
  ctx.reply(
    " Please provide a QR code image for reading QR codes. To convert text to a QR code, please enter the text.\n\n🇺🇿 Qr kodni o'qish uchun qr kod bor rasm jonating. Yozuvni qr kod ga aylantirish uchun yozuv yozing",
    { reply_markup: { keyboard: keyboard.build(), resize_keyboard: true } }
  )
})
bot.command('help', ctx => {
  ctx.reply(
    "Please provide a QR code image for reading QR codes. To convert text to a QR code, please enter the text.\n\n🇺🇿 Qr kodni o'qish uchun qr kod bor rasm jonating. Yozuvni qr kod ga aylantirish uchun yozuv yozing"
  )
})
bot.on(':web_app_data', ctx => {
  ctx.reply(ctx.msg.web_app_data.data)
})
bot.on('msg:text', async ctx => {
  const text = ctx.msg.text
  await ctx.replyWithChatAction('upload_photo')
  if (text.length > 1290) {
    const qrcodebuff = await QRCode.toBuffer(text, {
      width: 1200,
      color: { dark: '#162b42', light: '#4a7cb5' },
    })
    ctx.replyWithDocument(new InputFile(qrcodebuff, 'qrcode.png'))
    return
  }
  const qrcodebuff = await QRCode.toBuffer(text, {
    width: 800,
    color: { dark: '#162b42', light: '#4a7cb5' },
  })
  ctx.replyWithPhoto(new InputFile(qrcodebuff))
})
bot.on(':photo', async ctx => {
  await ctx.replyWithChatAction('typing')
  const fileOb = await ctx.getFile()
  const result = await readQrCode(
    `https://api.telegram.org/file/bot${token}/${fileOb.file_path}`
  )
  ctx.reply('Result:\n' + result?.data)
})
const readQrCode = async (file: string) => {
  const rim = await jimp.read(file)
  const imagew = rim.getWidth()
  const imageh = rim.getHeight()
  const image = Uint8ClampedArray.from(rim.bitmap.data)
  const result = jsQR(image, imagew, imageh)
  return result
}
bot.start()
console.log('Bot has been started')
