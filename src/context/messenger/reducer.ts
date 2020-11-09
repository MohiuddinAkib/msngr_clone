export const initialState = {
    darkMode: false
}

interface Action {
    type: string
}

export default (state: typeof initialState, action: Action): typeof initialState => {
    switch (action.type) {
        default:
            return state
    }
}