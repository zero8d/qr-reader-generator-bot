import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '../.env' })
console.log(__dirname)
import { Bot, InputFile } from 'grammy'
import jimp from 'jimp'
import jsQR from 'jsqr'
import QRCode from 'qrcode'
const token = process.env.BOT_TOKEN
const bot = new Bot(token)
bot.command('start', ctx => {
  ctx.reply(
    "Qr kodni o'qish uchun qr kod bor rasm jonating. Yozuvni qr kod ga aylantirish uchun yozuv yozing"
  )
})
bot.command('help', ctx => {
  ctx.reply(
    "Qr kodni o'qish uchun qr kod bor rasm jonating. Yozuvni qr kod ga aylantirish uchun yozuv yozing"
  )
})

bot.on('msg:text', async ctx => {
  const text = ctx.msg.text
  const qrcodebuff = await QRCode.toBuffer(text)

  ctx.replyWithPhoto(new InputFile(qrcodebuff))
})
bot.on(':photo', async ctx => {
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
