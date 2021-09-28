import { types } from '../types/types';


export const professionalReducer = (state = {},action : any) => {
    switch (action.type) {
        case types.professional:
            return {
                id : action.payload.id,
                first_name : action.payload.first_name,
                last_name : action.payload.last_name,
                profile_image : action.payload.profile_image,
                email : action.payload.email,
            }
            break;
    
        default:
            break;
    }
}