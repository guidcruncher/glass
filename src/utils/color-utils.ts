/**
 * Converts an RGB object to a Hexadecimal string.
 * @param {object} rgb - The RGB color object { r: 0-255, g: 0-255, b: 0-255 }
 * @returns {string} The Hex color string (e.g., "#ff0000")
 */
export function rgbToHex({ r, g, b }) {
  const toHex = (c) =>
    Math.round(Math.max(0, Math.min(255, c)))
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Converts an HSV object to a Hexadecimal string.
 * This is the core function for outputting the selected color.
 * @param {object} hsv - The HSV color object { h: 0-360, s: 0-100, v: 0-100 }
 * @returns {string} The Hex color string (e.g., "#ff0000")
 */
export function hsvToHex(hsv) {
  const { h, s, v } = hsv
  if (s === 0) {
    // Achromatic (Gray scale)
    const val = v * 2.55 // V is 0-100, scale to 0-255
    return rgbToHex({ r: val, g: val, b: val })
  }

  const hue = h / 60
  const saturation = s / 100
  const value = v / 100

  const i = Math.floor(hue)
  const f = hue - i
  const p = value * (1 - saturation)
  const q = value * (1 - f * saturation)
  const t = value * (1 - (1 - f) * saturation)

  let r, g, b

  switch (i % 6) {
    case 0:
      r = value
      g = t
      b = p
      break
    case 1:
      r = q
      g = value
      b = p
      break
    case 2:
      r = p
      g = value
      b = t
      break
    case 3:
      r = p
      g = q
      b = value
      break
    case 4:
      r = t
      g = p
      b = value
      break
    case 5:
      r = value
      g = p
      b = q
      break
  }

  return rgbToHex({ r: r * 255, g: g * 255, b: b * 255 })
}

/**
 * Converts a Hexadecimal string to an HSV object.
 * This is the core function for initializing the picker from the modelValue.
 * @param {string} hex - The Hex color string (e.g., "#ff0000" or "f00")
 * @returns {object} The HSV color object { h: 0-360, s: 0-100, v: 0-100 }
 */
export function hexToHsv(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 100, v: 100 } // Default red if invalid

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    v = max

  let d = max - min
  s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Scale H to 0-360, S/V to 0-100
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  }
}

// Exported for the Vue component
export default {
  hsvToHex,
  hexToHsv,
}
