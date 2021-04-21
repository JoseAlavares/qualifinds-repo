import {
    atom,
    selector
} from 'recoil';
import { getUsersService } from '../services/users.service'

const listUsers = atom({
    key: 'listUsers',
    default: []
});

export const getUsers = selector({
    key: 'getUsers',
    get: async ({get}) => {
        const result = await getUsersService();

        if(result.error) {
            throw new Error("Error in the products");
        }

        const {data: {data}} = result;
        return data;
    }
})