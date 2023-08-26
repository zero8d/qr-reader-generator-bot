// import Telegram from '@grammyjs/web-app'

const scan = () => {
  Telegram.WebApp.showScanQrPopup({}, data => {
    const qrdataEl = document.getElementById('data')
    qrdataEl.innerText = data
    Telegram.WebApp.closeScanQrPopup()
  })
}
