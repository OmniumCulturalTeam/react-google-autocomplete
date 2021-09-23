import { useEffect, useRef, useCallback } from "react";

import { loadGoogleMapScript, isBrowser } from "./utils";
import { GOOGLE_MAP_SCRIPT_BASE_URL } from "./constants";

export default function usePlacesWidget(props) {
  const catalonia = {
    "Espanya": "Catalunya",
    "España": "Cataluña",
    "Spain": "Catalonia",
  }

  const spain = {
    "Espanya": "",
    "España": "",
    "Spain": ""
  }

  const france = {
    "França": "",
    "Francia": "",
    "France": ""
  }

  const italy = {
    "Itàlia": "",
    "Italia": "",
    "Italy": ""
  }

  const {
    ref,
    onPlaceSelected,
    apiKey,
    inputAutocompleteValue = "adreça",
    options: {
      types = ["(cities)"],
      componentRestrictions,
      fields = [
        "address_components",
        "geometry.location",
        "place_id",
        "formatted_address",
      ],
      bounds,
      ...options
    } = {},
    googleMapsScriptBaseUrl = GOOGLE_MAP_SCRIPT_BASE_URL,
    language,
  } = props;
  const inputRef = useRef(null);
  const event = useRef(null);
  const autocompleteRef = useRef(null);
  const observerHack = useRef(null);
  const languageQueryParam = language ? `&language=${language}` : "";
  const googleMapsScriptUrl = `${googleMapsScriptBaseUrl}?libraries=places&key=${apiKey}${languageQueryParam}`;

  const handleLoadScript = useCallback(
    () => loadGoogleMapScript(googleMapsScriptBaseUrl, googleMapsScriptUrl),
    [googleMapsScriptBaseUrl, googleMapsScriptUrl]
  );

  useEffect(() => {
    const config = {
      ...options,
      fields,
      types,
      bounds,
    };

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    if (autocompleteRef.current || !inputRef.current || !isBrowser) return;

    if (ref && !ref.current) ref.current = inputRef.current;

    const handleAutoComplete = () => {
      if (typeof google === "undefined")
        return console.error(
          "Google has not been found. Make sure your provide apiKey prop."
        );

      if (!google.maps.places)
        return console.error("Google maps places API must be loaded.");

      if (!inputRef.current instanceof HTMLInputElement)
        return console.error("Input ref must be HTMLInputElement.");

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        config
      );

      event.current = autocompleteRef.current.addListener(
        "place_changed",
        () => {
          if (onPlaceSelected && autocompleteRef && autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            const country_code = place.address_components.find((x) => x.types[0] == "country")
            const political = place.address_components.find((x) => x.types[0] == "administrative_area_level_1")

            if (country_code && country_code.short_name == "ES") {
              if ( political.short_name == "CT") {
                for ( const [key, value] of Object.entries(catalonia) )
                  place.formatted_address = place.formatted_address.replace(", " + key, ", " + value)
              }else{
                for ( const [key, value] of Object.entries(spain) )
                  place.formatted_address = place.formatted_address.replace(", " + key, ", " + value)
              }
            }
            if (country_code && country_code.short_name == "FR") {
              for ( const [key, value] of Object.entries(france) )
                place.formatted_address = place.formatted_address.replace(", " + key, ", " + value)
            }
            if (country_code && country_code.short_name == "IT") {
              for ( const [key, value] of Object.entries(italy) )
                place.formatted_address = place.formatted_address.replace(", " + key, ", " + value)
            }

            onPlaceSelected(
              place,
              inputRef.current,
              autocompleteRef.current
            );
          }
        }
      );
    };

    if (apiKey) {
      handleLoadScript().then(() => handleAutoComplete());
    } else {
      handleAutoComplete();
    }

    return () => (event.current ? event.current.remove() : undefined);
  }, []);

  // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
  useEffect(() => {
    if (
      isBrowser &&
      window.MutationObserver &&
      inputRef.current &&
      inputRef.current instanceof HTMLInputElement
    ) {
      observerHack.current = new MutationObserver(() => {
        observerHack.current.disconnect();

        inputRef.current.autocomplete = inputAutocompleteValue;
      });
      observerHack.current.observe(inputRef.current, {
        attributes: true,
        attributeFilter: ["autocomplete"],
      });
    }
  }, [inputAutocompleteValue]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setFields(fields);
    }
  }, [fields]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setBounds(bounds);
    }
  }, [bounds]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setComponentRestrictions(componentRestrictions);
    }
  }, [componentRestrictions]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setOptions(options);
    }
  }, [options]);

  return {
    ref: inputRef,
    autocompleteRef,
  };
}
