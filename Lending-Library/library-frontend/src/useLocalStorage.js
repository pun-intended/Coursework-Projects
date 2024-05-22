import { useEffect, useState } from "react"

    
function getStored(key, defaultVal){
    const stored = localStorage.getItem(key);
    const initial_state = JSON.parse(stored)
    return initial_state || defaultVal
}

function useLocalStorage(key, defaultVal) {
        const [val, setVal] = useState(() => {
            return getStored(key, defaultVal)
        });

        useEffect(() => {
            localStorage.setItem(key, JSON.stringify(val))
        }, [key, val]);

    return [val, setVal]
}

export default useLocalStorage;