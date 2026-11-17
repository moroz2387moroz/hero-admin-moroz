import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../../actions";

const HeroesAddForm = () => {
  const [heroName, setHeroName] = useState("");
  const [heroDescr, setHeroDescr] = useState("");
  const [heroElement, setHeroElement] = useState("");

  const { filters } = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  const { request } = useHttp();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroDescr,
      element: heroElement,
    };

    setSubmitError("");
    setIsSubmitting(true);
    request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
      .then((hero) => {
        dispatch(heroCreated(hero));
        setHeroName("");
        setHeroDescr("");
        setHeroElement("");
      })
      .catch((error) => {
        console.error("Не удалось создать героя", error);
        setSubmitError("Не удалось создать героя. Попробуйте снова.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const renderFilters = (filters) => {
    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        if (name === "all") {
          return null;
        }

        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          value={heroDescr}
          onChange={(e) => setHeroDescr(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          value={heroElement}
          onChange={(e) => setHeroElement(e.target.value)}
        >
          <option value="">Я владею элементом...</option>
          {renderFilters(filters)}
        </select>
      </div>

      {submitError && (
        <p className="text-danger" role="alert">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
