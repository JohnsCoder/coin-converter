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
      const coinTemplate = `${coins["first-coin"] || "USD"}${
        coins["secound-coin"] || "BRL"
      }`;
      api
        .get(
          `/last/${coins["first-coin"] || "USD"}-${
            coins["secound-coin"] || "BRL"
          }`
        )
        .then((res) => {
          const { code, codein, high, create_date } = res.data[coinTemplate];
          const [firstName, secoundName] = [
            res.data[coinTemplate].name.split("/")[0],
            res.data[coinTemplate].name.split("/")[1],
          ];
          setDataCoins({
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
      "secound-value": (dataCoins.data[4] * value["first-value"]).toFixed(3),
    }));
  }

  function handleUpdateFirstValue(e) {
    setValue((value) => ({
      ...value,
      [e.target.name]: e.target.value,
    }));

    setValue((value) => ({
      ...value,
      "first-value": (value["secound-value"] / dataCoins.data[4]).toFixed(3),
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
            name="first-coin"
            onChange={handleCoinChange}
            value={coins["first-coin"] || "USD"}
          >
            {typeof allCoins !== "undefined" &&
              allCoins.map((e, y) => {
                return (
                  <OptionCoins key={y} value={e.abbreviation} name={e.name} />
                );
              })}
          </select>
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
          <select
            name="secound-coin"
            onChange={handleCoinChange}
            value={coins["secound-coin"] || "BRL"}
          >
            {typeof allCoins !== "undefined" &&
              allCoins.map((e, y) => {
                return (
                  <OptionCoins key={y} value={e.abbreviation} name={e.name} />
                );
              })}
          </select>
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
          <span>info:</span>

          <div>
            <div>
              <span>
                {typeof dataCoins !== "undefined" &&
                  `${dataCoins.data[0]}/${dataCoins.data[2]}`}{" "}
                - {value["first-value"] || 0}
              </span>
            </div>

            <div>
              <span>
                {typeof dataCoins !== "undefined" &&
                  `${dataCoins.data[1]}/${dataCoins.data[3]}`}{" "}
                - {value["secound-value"] || 0}
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
