import AppManagementController from './AppManagementController'
import PermissionController from './PermissionController'
import AggregatorController from './AggregatorController'

const Hub = {
    AppManagementController: Object.assign(AppManagementController, AppManagementController),
    PermissionController: Object.assign(PermissionController, PermissionController),
    AggregatorController: Object.assign(AggregatorController, AggregatorController),
}

export default Hub