import React from 'react'

const usePrevious = <T>(value) => {
    const ref = React.useRef<T>();

    React.useEffect(() => {
        ref.current = value;
    });
    
    return ref.current;
}

export default usePrevious
