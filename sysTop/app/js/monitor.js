const path = require('path');
const osu = require('node-os-utils')
const {ipcRenderer} = require('electron')

const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload
let alertFrequency

// Get Settings and values
ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverload = +settings.cpuOverload
  alertFrequency = +settings.alertFrequency
})

// Send Notification
const notifyUser = (options) => {
  new Notification(options.title, options)
}

// Check how much time have passed since notification
const runNotify = (frequency) => {
  if (localStorage.getItem('lastNotify') === null) {
    localStorage.setItem('lastNotify', String(+new Date()))
    return true
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
  const now = new Date()
  const diffTime = Math.abs(now - notifyTime)
  const minutesPassed = Math.ceil(diffTime/(1000 * 60))

  if (minutesPassed > frequency) {
    return true
  } else {
    return false
  }
}

// Run every 2 seconds
setInterval(() => {
  cpu.usage().then(info => {
    document.getElementById('cpu-usage').innerText = info + '%'

    document.getElementById('cpu-progress').style.width = info + '%'

    // Make progress bar read if overload
    if (info > cpuOverload) {
      document.getElementById('cpu-progress').style.background = 'red'
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b'
    }

    // Check overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: 'CPU Overload',
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, 'img', 'icon.png')
      })
      localStorage.setItem('lastNotify', String(+new Date()))
    }
  })

  cpu.free().then(info => {
    document.getElementById('cpu-free').innerText = info + '%'
  })

  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime())
}, 2000)

// Get computer model
document.getElementById('cpu-model').innerText = cpu.model()

// Get computer name
document.getElementById('comp-name').innerText = os.hostname()

// Os
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// Total Memory
mem.info().then(info => {
  document.getElementById('mem-total').innerText = info.totalMemMb
})

// Show days, hours, minutes and seconds
const secondsToDhms = (seconds) => {
  seconds = + seconds;
  const days = Math.floor(seconds/(3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24))/ 3600);
  const minutes = Math.floor((seconds % 3600)/ 60)
  const s = Math.floor(seconds % 60)
  return `${days}d, ${hours}h, ${minutes}m, ${s}s`
}
