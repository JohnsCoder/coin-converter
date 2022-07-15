import React, { useEffect, useState } from "react";
import "../styles/main/App.css";
import "font-awesome/css/font-awesome.min.css";
import api from "../services/api";
import CurrencyList from "../components/currencyList";
import { AxiosResponse } from "axios";

type handleUpdates = {
  target: {
    name: string;
    value: string;
  };
};

type currencies = {
  ["first-coin"]: string;
  ["secound-coin"]: string;
};

type dataCurrency = {
  date: string;
  firstInfo: string;
  secoundInfo: string;
  data: [string, string, string, string, number, string];
};

type err = {
  response: {
    data: {
      code: string;
    };
  };
};
type value = {
  ["first-value"]?: number;
  ["secound-value"]?: number;
};
function App() {
  const [dataCurrency, setDataCurrency] = useState<dataCurrency>({
    date: "",
    firstInfo: "",
    secoundInfo: "",
    data: ["", "", "", "", 1, ""],
  });
  const [currencies, setCurrencies] = useState<currencies>({
    "first-coin": "",
    "secound-coin": "",
  });
  const [value, setValue] = useState<value>({});

  function handleCoinChange(e: handleUpdates) {
    setCurrencies((coins) => ({
      ...coins,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    function getInfo() {
      const currencyTemplate = [
        `${currencies["first-coin"] || "USD"}`,
        `${currencies["secound-coin"] || "BRL"}`,
      ];
      api
        .get(`/last/${currencyTemplate[0]}-${currencyTemplate[1]}`)
        .then((res: AxiosResponse) => {
          const { code, codein, high, create_date } =
            res.data[currencyTemplate.join("")];
          const [firstName, secoundName] = [
            res.data[currencyTemplate.join("")].name.split("/")[0],
            res.data[currencyTemplate.join("")].name.split("/")[1],
          ];

          setDataCurrency({
            date: `${create_date.split(" ")[0].split("-")[2]}-${
              create_date.split(" ")[0].split("-")[1]
            }-${create_date.split(" ")[0].split("-")[0]}`,
            firstInfo: `1 ${firstName}/${code} = ${high} ${secoundName}`,
            secoundInfo: `1 ${secoundName}/${codein} = ${(1 / high).toFixed(
              4
            )} ${firstName}`,
            data: [firstName, secoundName, code, codein, high, create_date],
          });
        })
        .catch((err: err) => alert(err.response.data.code));
    }
    getInfo();
  }, [currencies]);

  function handleUpdateSecoundValue(e: handleUpdates) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      "secound-value": dataCurrency.data[4] * (value["first-value"] || 0),
    }));
  }

  function handleUpdateFirstValue(e: handleUpdates) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      "first-value": (value["secound-value"] || 0) / dataCurrency.data[4],
    }));
  }

  return (
    <div className="App">
      <header>
        <h1>COIN_CONVERTER</h1>
      </header>

      <div className="coins">
        <div>
          <CurrencyList
            name="first-coin"
            onChange={handleCoinChange}
            value={currencies["first-coin"] || "USD"}
          />
          <hr />
          <input
            name="first-value"
            type="number"
            placeholder="10,00"
            onChange={handleUpdateSecoundValue}
            value={value["first-value"] || ""}
          />
        </div>

        <div>
          <CurrencyList
            name="secound-coin"
            onChange={handleCoinChange}
            value={currencies["secound-coin"] || "BRL"}
          />
          <hr />
          <input
            name="secound-value"
            type="number"
            placeholder="10,00"
            onChange={handleUpdateFirstValue}
            value={value["secound-value"] || ""}
          />
        </div>
      </div>

      <div className="info-coins">
        <div>
          <h1>info:</h1>

          <div>
            <div>
              <span>
                {typeof dataCurrency !== "undefined" &&
                  `${dataCurrency.data[0]}/${dataCurrency.data[2]}`}
                - {value["first-value"] || 0}
              </span>
            </div>

            <div>
              <span>
                {typeof dataCurrency !== "undefined" &&
                  `${dataCurrency.data[1]}/${dataCurrency.data[3]}`}
                - {value["secound-value"] || 0}
              </span>
            </div>
          </div>

          <div>
            <span>
              Data: {typeof dataCurrency !== "undefined" && dataCurrency.date}
            </span>
            <span>
              {typeof dataCurrency !== "undefined" && dataCurrency.firstInfo}
            </span>
            <span>
              {typeof dataCurrency !== "undefined" && dataCurrency.secoundInfo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
