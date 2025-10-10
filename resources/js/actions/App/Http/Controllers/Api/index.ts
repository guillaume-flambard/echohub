import ServiceAccountController from './ServiceAccountController'
import ExternalApiController from './ExternalApiController'

const Api = {
    ServiceAccountController: Object.assign(ServiceAccountController, ServiceAccountController),
    ExternalApiController: Object.assign(ExternalApiController, ExternalApiController),
}

export default Api