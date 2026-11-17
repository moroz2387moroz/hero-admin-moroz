
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroCreated } from '../../actions';

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
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filters);
    const elements = filters.filter(filter => filter !== 'all');

    const onSubmit = (event) => {
        event.preventDefault();

        const newHero = {
            id: uuidv4(),
            name,
            description,
            element
        };

        dispatch(heroCreated(newHero));

        setName('');
        setDescription('');
        setElement('');
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

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;