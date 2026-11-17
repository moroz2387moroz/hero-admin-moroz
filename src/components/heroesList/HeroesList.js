import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { createSelector } from "reselect";

import { useHttp } from "../../hooks/http.hook";
import {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  heroDeleted,
} from "../../actions";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

import "./heroesList.scss";

const filteredHeroesSelector = createSelector(
  (state) => state.filters.activeFilter,
  (state) => state.heroes.heroes,
  (filter, heroes) =>
    filter === "all"
      ? heroes
      : heroes.filter((hero) => hero.element === filter),
);

const HeroesList = () => {
  const filteredHeroes = useSelector(filteredHeroesSelector);
  const heroesLoadingStatus = useSelector(
    (state) => state.heroes.heroesLoadingStatus,
  );
  const dispatch = useDispatch();
  const { request } = useHttp();
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
      .then((data) => dispatch(heroesFetched(data)))
      .catch((error) => {
        console.error("Не удалось загрузить героев", error);
        dispatch(heroesFetchingError());
      });
  }, [dispatch, request]);

  const onDelete = useCallback(
    (id) => {
      setDeleteError("");
      request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then(() => dispatch(heroDeleted(id)))
        .catch((error) => {
          console.error("Не удалось удалить героя", error);
          setDeleteError("Не удалось удалить героя. Попробуйте снова.");
        });
    },
    [dispatch, request],
  );

  if (heroesLoadingStatus === "loading" || heroesLoadingStatus === "idle") {
    return <Spinner />;
  }

  if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки героев</h5>;
  }

  const renderHeroesList = (arr) => {
    if (arr.length === 0) {
      return (
        <CSSTransition key="empty" timeout={0} classNames="hero">
          <li className="text-center mt-5">Героев пока нет</li>
        </CSSTransition>
      );
    }

    return arr.map(({ id, ...props }) => {
      return (
        <CSSTransition key={id} timeout={500} classNames="hero">
          <HeroesListItem
            id={id}
            {...props}
            onDelete={onDelete}
          />
        </CSSTransition>
      );
    });
  };

  const elements = renderHeroesList(filteredHeroes);
  return (
    <>
      {deleteError && (
        <p className="text-center text-danger" role="alert">
          {deleteError}
        </p>
      )}
      <TransitionGroup component="ul">{elements}</TransitionGroup>
    </>
  );
};

export default HeroesList;
