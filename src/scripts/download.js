import FileSaver from 'file-saver'

function fileName() {
  let site = document.domain
  // prefixes
  site = site.replace(/https|www|http/g, '')
  // suffixes
  site = site.replace(
    /\.|com|gov|com|net|org|info|coop|int|co\.uk|org\.uk|ac\.uk|uk/g,
    ''
  )
  return `icon-${site}`
}

const download = {
  createRegDownload(i) {
    const filename = fileName()
    const blob = new Blob([i.svgString], { type: 'text/xml' })
    FileSaver.saveAs(blob, `${filename}.svg`)
  },

  copyRegClipboard(i) {
    const el = document.createElement('textarea')
    el.value = i.svgString
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  },

  copyIsolatedSVG() {
    const docEl = document.documentElement
    const string = new XMLSerializer().serializeToString(docEl)
    navigator.clipboard.writeText(string).then(
      () => {
        alert('The SVG was copied to your clipboard.')
      },
      err => {
        alert('Could not copy:', err)
      }
    )
  },
}

export default download