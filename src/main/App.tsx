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
  firstCoin: string;
  secoundCoin: string;
};

type dataCurrency = {
  date: string;
  firstInfo: string;
  secoundInfo: string;
  data: [
    firstName: string,
    secoundName: string,
    code: string,
    codein: string,
    high: number,
    create_date: string
  ];
};

type err = {
  response: {
    data: {
      code: string;
    };
  };
};
type value = {
  firstCoin: number;
  secoundCoin: number;
};

function App() {
  const [dataCurrency, setDataCurrency] = useState<dataCurrency>({
    date: "",
    firstInfo: "",
    secoundInfo: "",
    data: ["", "", "", "", 1, ""],
  });
  const [currencies, setCurrencies] = useState<currencies>({
    firstCoin: "",
    secoundCoin: "",
  });
  const [value, setValue] = useState<value>({
    firstCoin: NaN,
    secoundCoin: NaN,
  });

  function handleCoinChange(e: handleUpdates) {
    setCurrencies((coins) => ({
      ...coins,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    const currencyTemplate = [
      `${currencies.firstCoin || "USD"}`,
      `${currencies.secoundCoin || "BRL"}`,
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
  }, [currencies]);

  function handleUpdateSecoundValue(e: handleUpdates) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      secoundCoin: dataCurrency.data[4] * (value.firstCoin || 1),
    }));
  }

  function handleUpdateFirstValue(e: handleUpdates) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      firstCoin: (value.secoundCoin || 1) / dataCurrency.data[4],
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
            name='firstCoin'
            onChange={handleCoinChange}
            value={currencies.firstCoin || "USD"}
          />
          <hr />
          <input
            name='firstCoin'
            type="number"
            placeholder="10,00"
            onChange={handleUpdateSecoundValue}
            value={(value.firstCoin || '')}
          />
        </div>

        <div>
          <CurrencyList
            name='secoundCoin'
            onChange={handleCoinChange}
            value={currencies.secoundCoin || "BRL"}
          />
          <hr />
          <input
            name='secoundCoin'
            type="number"
            placeholder="10,00"
            onChange={handleUpdateFirstValue}
            value={(value.secoundCoin || '')}
          />
        </div>
      </div>

      <div className="info-coins">
        <div>
          <h1>info:</h1>

          <div>
            <div>
              <span>
                {`${dataCurrency.data[0]}/${dataCurrency.data[2]}`}-
                {value.firstCoin || 0}
              </span>
            </div>

            <div>
              <span>
                {`${dataCurrency.data[1]}/${dataCurrency.data[3]}`}-
                {value.secoundCoin || 0}
              </span>
            </div>
          </div>

          <div>
            <span>
              Data: {dataCurrency.date}
            </span>
            <span>
              {dataCurrency.firstInfo}
            </span>
            <span>
              {dataCurrency.secoundInfo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
