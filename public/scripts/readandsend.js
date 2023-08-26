document.onload = ev => scan()
const scan = () => {
  Telegram.WebApp.showScanQrPopup({}, data => {
    // const qrdataEl = document.getElementById('data')
    // qrdataEl.innerText = data
    Telegram.WebApp.closeScanQrPopup()
    Telegram.WebApp.sendData(data)
    Telegram.WebApp.close()
  })
}
