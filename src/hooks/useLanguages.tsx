import { useQuery } from 'react-query';

const languagesSelect = async () => {
    try {
        const result: any = await fetch('http://challenge.radlena.com/api/v1/languages');
        return result.json();
    } catch (error) {
        throw new Error("Error intentando acceder a los datos");
    }
}

export const useLanguages = () => {
   return useQuery('LANGUAGES',languagesSelect,{
    notifyOnChangePropsExclusions : ['isStale']
   });
}
