import React, { useEffect, useState } from "react";
import api from "../services/api";
function CurrencyList(props) {
  const [allCurrency, setAllCurrency] = useState([]);

  useEffect(() => {
    api.get("/json/available/uniq").then((res) => {
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
