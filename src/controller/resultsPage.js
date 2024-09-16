import { SEARCH_CITY_ELEMENT } from "../constants.js";
import { renderError } from "../view/components/renderError.js";
import { setSearchValue } from "../view/components/renderSearchHints.js";
import {
  renderResultPage,
  renderPlaces,
  renderEvents,
  renderLoading,
  setCategoryValue,
} from "../view/renderResultsPage.js";
import { executeSearch } from "./service/executeSearch.js";
import { getEvents } from "./service/getEvents.js";
import { getPlaces } from "./service/getPlaces.js";
import { inputCityAutocomplete } from "./service/inputCityAutocomplete.js";
import { navigation } from "./service/router.js";

export const resultsInit = async (
  city,
  startDate,
  endDate,
  location,
  category
) => {
  try {
    const latitude = JSON.parse(location).latitude;
    const longitude = JSON.parse(location).longitude;

    await renderResultPage(city, startDate, endDate, location);
    setSearchValue(
      document.getElementById(SEARCH_CITY_ELEMENT),
      city,
      location
    );

    setCategoryValue(category);

    const placePromises = getPlaces(location, category);

    const { events: eventsPromises, totalItems } = await getEvents(
      latitude,
      longitude,
      startDate,
      endDate
    );

    renderLoading("places", "show");
    renderLoading("events", "show");
    const [places, events] = await Promise.all([placePromises, eventsPromises]);

    await renderPlaces(places);
    renderLoading("places", "hide");

    await renderEvents(events, totalItems);
    renderLoading("events", "hide");

    inputCityAutocomplete();
    executeSearch();
    navigation();
  } catch (error) {
    renderError(error);
    throw error;
  }
};
