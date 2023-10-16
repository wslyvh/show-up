import { json, Bytes, dataSource, log } from '@graphprotocol/graph-ts'
import { EventMetadata } from '../generated/schema';

export function handleEventMetadata(content: Bytes): void {
    log.warning('ShowUp.Protocol - handleEventMetadata', [])
    let metadata = new EventMetadata(dataSource.stringParam())
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

        if (appId) metadata.appId = appId.toString()
        if (title) metadata.title = title.toString()
        if (description) metadata.description = description.toString()
        if (start) metadata.start = start.toString()
        if (end) metadata.end = end.toString()
        if (timezone) metadata.timezone = timezone.toString()
        if (location) metadata.location = location.toString()
        if (website) metadata.website = website.toString()
        if (imageUrl) metadata.imageUrl = imageUrl.toString()

        log.warning('ShowUp.Protocol - save eventMetadata | {}', [metadata.id])
        metadata.save()
    }

}