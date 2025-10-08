import serviceAccounts from './service-accounts'
import external from './external'

const api = {
    serviceAccounts: Object.assign(serviceAccounts, serviceAccounts),
    external: Object.assign(external, external),
}

export default api