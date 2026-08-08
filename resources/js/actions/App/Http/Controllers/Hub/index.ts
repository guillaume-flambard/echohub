import AggregatorController from './AggregatorController';
import AppManagementController from './AppManagementController';
import PermissionController from './PermissionController';

const Hub = {
    AppManagementController: Object.assign(
        AppManagementController,
        AppManagementController,
    ),
    PermissionController: Object.assign(
        PermissionController,
        PermissionController,
    ),
    AggregatorController: Object.assign(
        AggregatorController,
        AggregatorController,
    ),
};

export default Hub;
