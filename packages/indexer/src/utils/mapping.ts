export function GetStatusName(number: number = 0) {
    switch (number) {
        case 0: return 'Active'
        case 1: return 'Cancelled'
        case 2: return 'Settled'
    }

    return 'Active'
}

export function GetStatusId(status: 'Active' | 'Cancelled' | 'Settled' = 'Active') {
    switch (status) {
        case 'Active': return 0
        case 'Cancelled': return 1
        case 'Settled': return 2
    }
}

export function GetVisibilityName(number: number = 0) {
    switch (number) {
        case 0: return 'Public'
        case 1: return 'Unlisted'
    }

    return 'Public'
}

export function GetVisibilityId(visibility: 'Public' | 'Unlisted' = 'Public') {
    switch (visibility) {
        case 'Public': return 0
        case 'Unlisted': return 1
    }
}

export function TruncateMiddle(text: string, length: number = 5) {
    if (text?.length > length * 2 + 1) {
        return `${text.substring(0, length)}...${text.substring(text.length - length, text.length)}`
    }

    return text
}
