import React, { useEffect, useState } from "react";
import api from "../services/api";

type axiosResp = {
  data: object;
};
type currencyList = {
  abbreviation: string;
  name: string;
};

type handleUpdates = {
     target: {
       name: string;
       value: string;
     };
   };

type props = {
     name: string,
     onChange: (e: handleUpdates) => void,
     value: string
}

function CurrencyList(props: props) {
  const [allCurrency, setAllCurrency] = useState<currencyList[]>([]);

  useEffect(() => {
    api.get("/json/available/uniq").then((res: axiosResp) => {
      for (const i in Object.keys(res.data)) {
        setAllCurrency((allCoins) => [
          ...allCoins,
          {
            abbreviation: Object.keys(res.data)[i],
            name: Object.values(res.data)[i],
          },
        ]);
      }
    });
  }, []);

  return (
    <select {...props}>
      {typeof allCurrency !== "undefined" &&
        allCurrency.map((e, y) => {
          return (
            <option key={y} value={e.abbreviation}>
              {e.name}
            </option>
          );
        })}
    </select>
  );
}

export default CurrencyList;
