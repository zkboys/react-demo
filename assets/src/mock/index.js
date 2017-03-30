import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockUser from './mock-user';
import mockOrg from './mock-org';
import mockRole from './mock-role';

const mock = new MockAdapter(axios);

mockUser(mock);
mockOrg(mock);
mockRole(mock);
