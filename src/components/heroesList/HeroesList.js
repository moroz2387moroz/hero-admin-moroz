import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroDeleted } from '../../actions';
import { HEROES_API_URL } from '../../constants';
import { useHttp } from '../../hooks/http.hook';
import HeroesListItem from "../heroesListItem/HeroesListItem";

const HeroesList = () => {
    const {heroes, activeFilter} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const onDelete = async (id) => {
        setError('');
        setDeletingId(id);

        try {
            await request(`${HEROES_API_URL}/${encodeURIComponent(id)}`, 'DELETE');
            dispatch(heroDeleted(id));
        } catch (requestError) {
            setError(`Не удалось удалить героя: ${requestError.message}`);
        } finally {
            setDeletingId(null);
        }
    }

    const filteredHeroes = activeFilter === 'all'
        ? heroes
        : heroes.filter(hero => hero.element === activeFilter);

    return (
        <>
            {error && <p className="text-danger bg-white p-2 rounded" role="alert">{error}</p>}
            <ul>
                {filteredHeroes.length === 0
                    ? <h5 className="text-center mt-5">Героев пока нет</h5>
                    : filteredHeroes.map(({id, ...props}) => (
                        <HeroesListItem
                            key={id}
                            id={id}
                            {...props}
                            onDelete={onDelete}
                            isDeleting={deletingId === id}
                        />
                    ))}
            </ul>
        </>
    )
}

export default HeroesList;