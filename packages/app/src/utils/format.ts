import slugify from 'slugify'

export function Slugify(value: string) {
    return slugify(value, { strict: true, lower: true })
}