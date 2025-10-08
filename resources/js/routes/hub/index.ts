import apps from './apps'
import permissions from './permissions'
import aggregator from './aggregator'

const hub = {
    apps: Object.assign(apps, apps),
    permissions: Object.assign(permissions, permissions),
    aggregator: Object.assign(aggregator, aggregator),
}

export default hub