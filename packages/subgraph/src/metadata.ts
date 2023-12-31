import { json, Bytes, dataSource, log } from '@graphprotocol/graph-ts'
import { Event } from '../generated/schema';

export function handleEventMetadata(content: Bytes): void {
    log.debug('ShowUp.Protocol - EventMetaData', [])
    let metadata = new Event(dataSource.stringParam())
    const value = json.fromBytes(content).toObject()

    if (value) {
        const appId = value.get('appId')
        const title = value.get('title')
        const description = value.get('description')
        const start = value.get('start')
        const end = value.get('end')
        const timezone = value.get('timezone')
        const location = value.get('location')
        const website = value.get('website')
        const imageUrl = value.get('imageUrl')
        const visibility = value.get('visibility')

        if (appId) metadata.appId = appId.toString()
        if (title) metadata.title = title.toString()
        if (description) metadata.description = description.toString()
        if (start) metadata.start = start.toString()
        if (end) metadata.end = end.toString()
        if (timezone) metadata.timezone = timezone.toString()
        if (location) metadata.location = location.toString()
        if (website) metadata.website = website.toString()
        if (imageUrl) metadata.imageUrl = imageUrl.toString()
        if (visibility) {
            metadata.visibility = visibility.toString()
        } else {
            metadata.visibility = 'Public'
        }

        metadata.save()
    }

}