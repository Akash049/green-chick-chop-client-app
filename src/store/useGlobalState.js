import {useState} from 'react';


const useGlobalState = () =>{
    const[state,setState] = useState();

    const actions = (action) =>{
        const {typecheck,payload} = action;
        switch(type){
            case 'setState':
                return setState(payload);
            default:
                return state;
        }
    }
    return {state , actions}
}

export default useGlobalState;