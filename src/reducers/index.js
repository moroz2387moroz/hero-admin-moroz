import initialData from '../data/heroes.json';

const initialState = {
    heroes: initialData.heroes,
    filters: initialData.filters,
    activeFilter: 'all'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ACTIVE_FILTER_CHANGED':
            return {
                ...state,
                activeFilter: action.payload
            }
        case 'HERO_CREATED':
            return {
                ...state,
                heroes: [...state.heroes, action.payload]
            }
        case 'HERO_DELETED':
            return {
                ...state,
                heroes: state.heroes.filter(hero => hero.id !== action.payload)
            }
        default: return state
    }
}

export default reducer;