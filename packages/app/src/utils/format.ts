import slugify from 'slugify'

export function Slugify(value: string) {
  return slugify(value, { strict: true, lower: true })
}

export function TruncateMiddle(text: string, length: number = 5) {
  if (text?.length > length * 2 + 1) {
    return `${text.substring(0, length)}...${text.substring(text.length - length, text.length)}`
  }

  return text
}
