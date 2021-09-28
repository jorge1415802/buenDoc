import { useState } from 'react'

export const useForm = (initialState : any = {}) => {
    const [state, setState] = useState(initialState)

    const handleInputChange = ({target} : {target : any}) => {
        setState({
            ...state,
            [target.name] : target.value,
        })
    }

    return [state, handleInputChange];
}

