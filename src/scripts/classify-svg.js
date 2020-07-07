const classify = {
  determineType() {
    if (this.origEle.tagName === 'svg') {
      const firstChild = this.origEle.firstElementChild

      if (firstChild && firstChild.tagName === 'symbol') {
        this.type = 'symbol'
        this.spriteMaster = true
      } else if (firstChild && firstChild.tagName === 'use') {
        this.type = 'sprite'
        this.spriteId = firstChild.getAttributeNS(
          'http://www.w3.org/1999/xlink',
          'href'
        )
      } else {
        this.type = 'inline'
      }
    } else if (this.origEle.tagName === 'IMG') {
      this.url = this.origEle.src
      this.type = 'img src'
    } else if (this.origEle.tagName === 'OBJECT') {
      this.url = this.data
      this.type = 'object'
    } else if (this.origEle.tagName === 'DIV') {
      const style = window.getComputedStyle(this.origEle, null)
      const url = style.backgroundImage.slice(4, -1).replace(/"/g, '')
      const fileType = url.substr(url.lastIndexOf('.') + 1)

      if (style.backgroundImage !== 'none' && /(svg)$/gi.test(fileType)) {
        this.url = url
        this.type = 'bg img'
      }
    }
    return this
  },

  buildSpriteString() {
    if (this.spriteId) {
      const symbolLink = document.querySelector(this.spriteId).cloneNode(true)
      if (symbolLink) {
        this.origEle.prepend(symbolLink)
      }
    }
    return this
  },

  getRects(el) {
    const rects = el.getBoundingClientRect()
    this.height = Math.ceil(rects.height)
    this.width = Math.ceil(rects.width)
  },

  determineSize() {
    this.size = `${this.width}x${this.height}`

    if (this.width === 0 && this.height === 0) {
      this.size = 'Hidden'
    } else if (
      this.origEle.hasAttribute('width') &&
      this.origEle.hasAttribute('height')
    ) {
      const width = this.origEle.getAttribute('width')
      const height = this.origEle.getAttribute('height')
      if (width.includes('%' || 'em')) {
        this.size = ''
      } else if (width.includes('px')) {
        this.size = `${width.slice(0, -2)}x${height.slice(0, -2)}`
      } else {
        this.size = `${width}x${height}`
        this.width = width
        this.height = height
      }
    }
    return this
  },

  async fetchSvg() {
    const serializer = new XMLSerializer()
    this.svgString = serializer.serializeToString(this.origEle)

    this.origEle.setAttribute('class', 'gob__card__svg__trick')
    this.origEle.removeAttribute('height')
    this.origEle.removeAttribute('width')
    this.origEle.removeAttribute('style')
    this.origEle.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    if (!this.origEle.hasAttribute('viewBox')) {
      this.origEle.setAttribute('viewBox', `0 0 ${this.height} ${this.width}`)
    }

    if (this.origEle.getAttribute('viewBox') === '0 0 0 0') {
      this.origEle.setAttribute('viewBox', `0 0 24 24`)
    }

    this.presentationSvg = serializer.serializeToString(this.origEle)

    if (this.url) {
      try {
        await fetch(this.url).then(response => {
          response.text().then(text => {
            // Would love to optimize this but not sure
            // how to conver it to elements
            this.presentationSvg = text
            this.svgString = text
          })
        })
      } catch (error) {
        this.cors = true
      }
    }
    return this
  },

  checkForWhite() {
    const whiteStrings = ['white', '#FFF', '#FFFFFF', '#fff', '#ffffff']

    for (const string of whiteStrings) {
      if (this.svgString && this.svgString.includes(string)) {
        this.hasWhite = true
      }
    }

    return this
  },
}

export default classify
