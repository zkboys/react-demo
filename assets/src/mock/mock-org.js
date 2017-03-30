import orgs from './mockdata/organizations';

export default function (mock) {
    mock.onGet('/api/organization/organizations').reply(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, orgs]);
            }, 1000);
        });
    });
}
