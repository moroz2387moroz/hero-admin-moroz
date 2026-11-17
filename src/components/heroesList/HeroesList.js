import { useDispatch, useSelector } from 'react-redux';

import { heroDeleted } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";

const HeroesList = () => {
    const {heroes, activeFilter} = useSelector(state => state);
    const dispatch = useDispatch();

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} id={id} {...props} onDelete={onDelete}/>
        })
    }

    const onDelete = (id) => {
        dispatch(heroDeleted(id));
    }

    const filteredHeroes = activeFilter === 'all'
        ? heroes
        : heroes.filter(hero => hero.element === activeFilter);
    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;