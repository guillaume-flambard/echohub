import aggregator from './aggregator';
import apps from './apps';
import permissions from './permissions';

const hub = {
    apps: Object.assign(apps, apps),
    permissions: Object.assign(permissions, permissions),
    aggregator: Object.assign(aggregator, aggregator),
};

export default hub;
