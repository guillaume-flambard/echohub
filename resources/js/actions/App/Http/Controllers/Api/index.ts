import ExternalApiController from './ExternalApiController';
import ServiceAccountController from './ServiceAccountController';

const Api = {
    ServiceAccountController: Object.assign(
        ServiceAccountController,
        ServiceAccountController,
    ),
    ExternalApiController: Object.assign(
        ExternalApiController,
        ExternalApiController,
    ),
};

export default Api;
