import external from './external';
import serviceAccounts from './service-accounts';

const api = {
    serviceAccounts: Object.assign(serviceAccounts, serviceAccounts),
    external: Object.assign(external, external),
};

export default api;
