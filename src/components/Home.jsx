import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [role, setRole] = useState("USD");
  const [isWatched, setIsWatched] = useState(false);
  const [trend, setTrend] = useState([]);
  const [secondTrend, setSecondTrend] = useState([]);

  const handleSelect = (e) => {
    setRole(e.target.value);
    setCurrentPage(1);
  };

  function getSecondTrend(role, limit) {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${role}&order=gecko_desc&per_page=${limit}&page=3&sparkline=false&price_change_percentage=24h`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSecondTrend(data);
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
      });
  }

  function getTrend(role, limit) {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${role}&order=gecko_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setTrend(data);
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
      });
  }

  async function getData(role, page, limit) {
    try {
      const response = await fetch(`
      https://api.coingecko.com/api/v3/coins/markets?vs_currency=${role}&order=gecko_desc&per_page=${limit}&page=${page}&sparkline=false&price_change_percentage=24h
      `);
      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData(role, currentPage, 10)
  }, [role, currentPage])




  const handleChange = (event, value) => {
    setCurrentPage(value);
    console.log(value);
  };
  

  useEffect(() => {
    getSecondTrend(role, 4);
    getTrend(role, 4);
  }, []);
  

  let symbol = "";
  if (role === "USD") {
    symbol = "$";
  } else if (role === "EUR") {
    symbol = "€";
  } else if (role === "INR") {
    symbol = "₹";
  }

  const renderEyeIcon = (isWatched) => {
    return (
      <IoEye
        style={{ color: isWatched ? "green" : "white" }}
        className="icon-eye"
      />
    );
  };

  // function handleSingle(e) {
  //   navigate("/single");
  //   localStorage.setItem("single", JSON.stringify(e));
  //   const storedItems = localStorage.getItem("items");
  //   let items = storedItems ? JSON.parse(storedItems) : [];

  //   let shouldAddItem = true;
  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i] === e) {
  //       shouldAddItem = false;
  //       break;
  //     }
  //   }

  //   if (shouldAddItem) {
  //     items.push(e);
  //     localStorage.setItem("items", JSON.stringify(items));
  //   } else {
  //     console.log(`Item with ID ${e} already exists in localStorage.`);
  //   }
  // }

  const handleSingle = (Product) => {
    navigate("/single");
    const storedItems = localStorage.getItem("items");
    let items = storedItems ? JSON.parse(storedItems) : [];
  
    const productExists = items.some((item) => item.id === Product.id);
  
    if (!productExists) {
      items = [...items, { ...Product }];
  
      localStorage.setItem("items", JSON.stringify(items));
  
      console.log(items);
    } else {
      console.log(`Product with ID ${Product.id} already exists in localStorage.`);
    }
  
    localStorage.setItem("single", JSON.stringify(Product.id));
  };

  

  function handleTrend(e) {
    console.log(e);
    localStorage.setItem("single", JSON.stringify(e));
    navigate("/single");
  }

  const [green, setGreen] = useState([])

  function handleEye() {
    if(localStorage.getItem('items')) {
      setGreen(JSON.parse(localStorage.getItem('items')))
    }
  }
  console.log(green);
  useEffect(() => {
    handleEye()
  }, [])

  return (
    <div className="home">
      <div className="home-head">
        <select value={role} onChange={handleSelect}>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
        <div className="title">
          <h1>CRYPTOFOLIO WATCH LIST</h1>
          <p>Get all the Info regarding your favorite Crypto Currency</p>
        </div>
        <div className="slider">
          <div className="slider-cards">
            {trend.length > 0 &&
              trend.map((el) => {
                return (
                  <div
                    className="slider-card"
                    key={el.id}
                    onClick={() => handleTrend(el.id)}
                  >
                    <img src={el.image} alt="" />
                    <div className="slider-card-body">
                      <p>{el.symbol}</p>
                      {el.price_change_percentage_24h.toFixed(2) < 0 ? (
                        <span style={{ color: "red" }}>
                          {el.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>
                          {el.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <h3>
                      {symbol} {el.current_price.toLocaleString()}
                    </h3>
                  </div>
                );
              })}
          </div>
          <div id="slider-cards">
            {secondTrend.length > 0 &&
              secondTrend.map((el) => {
                return (
                  <div
                    className="slider-card"
                    key={el.id}
                    onClick={() => handleTrend(el.id)}
                  >
                    <img src={el.image} alt="" />
                    <div className="slider-card-body">
                      <p>{el.symbol}</p>
                      {el.price_change_percentage_24h.toFixed(2) < 0 ? (
                        <span style={{ color: "red" }}>
                          {el.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>
                          {el.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <h3>
                      {symbol} {el.current_price.toLocaleString()}
                    </h3>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="home-body">
        <h2>Cryptocurrency Prices by Market Cap</h2>
        <input type="text" placeholder="Search For a Crypto Currency.." />
        <table cellSpacing={0}>
          <tr className="head">
            <th id="th-head">Coin</th>
            <th className="th-head">Price</th>
            <th className="th-head">24h Change</th>
            <th className="th-head">Market Cap</th>
          </tr>
          {cars.map((car) => (
            <tr key={car.id} className="body" onClick={() => handleSingle(car)}>
              <td id="td-body">
                <div className="image-td">
                  <img src={car.image} alt="" />
                  <div className="td-name">
                    <h3> {car.symbol} </h3>
                    <span> {car.name} </span>
                  </div>
                </div>
              </td>
              <td className="td-body">
                <p>
                  {" "}
                  {symbol} {car.current_price.toLocaleString()}{" "}
                </p>
              </td>
              <td className="td-body">
                <span>
                  {
                    car.id === green.id ? setIsWatched(true) : setIsWatched(false)
                  }
                  {renderEyeIcon(isWatched)}{" "}
                  {car.price_change_percentage_24h.toFixed(2) < 0 ? (
                    <span style={{ color: "red" }}>
                      {car.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  ) : (
                    <span style={{ color: "green" }}>
                      {car.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  )}
                </span>
              </td>
              <td className="td-body">
                <p>
                  {symbol} {car.market_cap.toLocaleString()}M
                </p>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <div className="home-foot">
        <Stack spacing={2}>
        <Pagination
        count={10}  onChange={handleChange}
        sx={{
          "& .MuiPaginationItem-root": {
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
              color: "rgb(135, 206, 235)",
            },
          },
          "& button": {
            color: "rgb(135, 206, 235)",
          }
          }}
        />
        
        </Stack>
      </div>
    </div>
  );
}

export default Home;