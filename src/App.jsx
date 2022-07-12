import React, { useEffect, useState } from "react";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import OptionCoins from "./components/optionCoins";
import api from "./services/api";

function App() {
  const [allCoins, setAllCoins] = useState([]);
  const [dataCoins, setDataCoins] = useState();
  const [coins, setCoins] = useState([]);
  const [value, setValue] = useState([]);
  useEffect(() => {
    api.get("/json/available/uniq").then((res) => {
      for (const i in Object.keys(res.data)) {
        setAllCoins((allCoins) => [
          ...allCoins,
          {
            abbreviation: Object.keys(res.data)[i],
            name: Object.values(res.data)[i],
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    function getInfo() {
      const coinTemplate = `${coins.firstCoin || "USD"}${
        coins.secoundCoin || "BRL"
      }`;
      api
        .get(`/last/${coins.firstCoin || "USD"}-${coins.secoundCoin || "BRL"}`)
        .then((res) => {
          const { code, codein, high, create_date } = res.data[coinTemplate];
          const [firstName, secoundName] = [
            res.data[coinTemplate].name.split("/")[0],
            res.data[coinTemplate].name.split("/")[1],
          ];
          setDataCoins({
            date: `${create_date.split(" ")[0].split("-")[2]}-${create_date.split(" ")[0].split("-")[1]}-${create_date.split(" ")[0].split("-")[0]}`,
            firstInfo: `1 ${firstName}/${code} = ${high} ${secoundName}`,
            secoundInfo: `1 ${secoundName}/${codein} = ${(1 / high).toFixed(
              4
            )} ${firstName}`,
            data: [firstName, secoundName, code, codein, high, create_date],
          });
        })
        .catch((err) => alert(err.response.data.code));
    }
    getInfo();
  }, [coins]);

  function handleCoinChange(e) {
    setCoins((coins) => ({
      ...coins,
      [e.target.name]: e.target.value,
    }));
  }

  function handleUpdateSecoundValue(e) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      secoundValue: (dataCoins.data[4] * value.firstValue).toFixed(3),
    }));
  }

  function handleUpdateFirstValue(e) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      firstValue: (value.secoundValue / dataCoins.data[4]).toFixed(3),
    }));
  }

  return (
    <div className="App">
      <header>
        <span>COIN_CONVERTER</span>
      </header>

      <div className="coins">
        <div>
          <select
            name="firstCoin"
            onChange={handleCoinChange}
            value={coins.firstCoin || "USD"}
          >
            {typeof allCoins !== "undefined" &&
              allCoins.map((e, y) => {
                return (
                  <OptionCoins
                    key={y}
                    value={e.abbreviation}
                    name={e.abbreviation}
                  />
                );
              })}
          </select>
          <hr />
          <input
            name="firstValue"
            type="number"
            placeholder="10,00"
            onChange={handleUpdateSecoundValue}
            value={value.firstValue || ""}
          />
        </div>

        <div>
          <select
            name="secoundCoin"
            onChange={handleCoinChange}
            value={coins.secoundCoin || "BRL"}
          >
            {typeof allCoins !== "undefined" &&
              allCoins.map((e, y) => {
                return <OptionCoins key={y} value={e.abbreviation} />;
              })}
          </select>
          <hr />
          <input
            name="secoundValue"
            type="number"
            placeholder="10,00"
            onChange={handleUpdateFirstValue}
            value={value.secoundValue || ""}
          />
        </div>
      </div>

      <div className="info-coins">
        <div>
          <span>info:</span>

          <div>
            <div>
              <span>
                {typeof dataCoins !== "undefined" &&
                  `${dataCoins.data[0]}/${dataCoins.data[2]}`}{" "}
                - {value.firstValue || 0}
              </span>
            </div>

            <div>
              <span>
                {typeof dataCoins !== "undefined" &&
                  `${dataCoins.data[1]}/${dataCoins.data[3]}`}{" "}
                - {value.secoundValue || 0}
              </span>
            </div>
          </div>

          <div>
            <span>
              Data: {typeof dataCoins !== "undefined" && dataCoins.date}
            </span>
            <span>
              {typeof dataCoins !== "undefined" && dataCoins.firstInfo}
            </span>
            <span>
              {typeof dataCoins !== "undefined" && dataCoins.secoundInfo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
