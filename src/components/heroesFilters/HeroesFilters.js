import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { activeFilterChanged } from '../../actions';

const filterNames = {
    all: 'Все',
    fire: 'Огонь',
    water: 'Вода',
    wind: 'Ветер',
    earth: 'Земля'
};

const filterClasses = {
    all: 'btn-outline-dark',
    fire: 'btn-danger',
    water: 'btn-primary',
    wind: 'btn-success',
    earth: 'btn-secondary'
};

const HeroesFilters = () => {
    const dispatch = useDispatch();
    const {filters, activeFilter} = useSelector(state => state);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            type="button"
                            className={classNames('btn', filterClasses[filter] || 'btn-light', {
                                active: activeFilter === filter
                            })}
                            onClick={() => dispatch(activeFilterChanged(filter))}>
                            {filterNames[filter] || filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;