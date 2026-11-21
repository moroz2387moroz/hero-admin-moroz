
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroCreated } from '../../actions';
import { HEROES_API_URL } from '../../constants';
import { useHttp } from '../../hooks/http.hook';

const elementNames = {
    fire: 'Огонь',
    water: 'Вода',
    wind: 'Ветер',
    earth: 'Земля'
};

const HeroesAddForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const {request} = useHttp();
    const filters = useSelector(state => state.filters);
    const elements = filters.filter(filter => filter !== 'all');

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        const newHero = {
            id: uuidv4(),
            name,
            description,
            element
        };

        try {
            const createdHero = await request(HEROES_API_URL, 'POST', JSON.stringify(newHero));
            dispatch(heroCreated(createdHero));

            setName('');
            setDescription('');
            setElement('');
        } catch (requestError) {
            setError(`Не удалось создать героя: ${requestError.message}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={name}
                    onChange={({target}) => setName(target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    value={description}
                    onChange={({target}) => setDescription(target.value)}
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={element}
                    onChange={({target}) => setElement(target.value)}>
                    <option value="" disabled>Я владею элементом...</option>
                    {elements.map(filter => (
                        <option key={filter} value={filter}>
                            {elementNames[filter] || filter}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="text-danger mt-3 mb-0" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Создать'}
            </button>
        </form>
    )
}

export default HeroesAddForm;