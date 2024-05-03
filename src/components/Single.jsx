import React, { useEffect, useState } from "react";
import CryptoChart from "./ApexChart";
import { SkewLoader } from "react-spinners";

function Single() {
  const [name, setName] = useState(JSON.parse(localStorage.getItem("single")));
  const [product, setProduct] = useState(null); 
  const [firstParagraph, setFirstParagraph] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");

  const getItem = (itemName) => {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${itemName}`;
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.description && data.description.en) {
          const firstParagraph = data.description.en.split(".")[0];
          setFirstParagraph(firstParagraph);
        }
        setLoading(false); 
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); 
      });
  };

  useEffect(() => {
    if (name) {
      setLoading(true); 
      getItem(name); 
    }
  }, [name]);

  return (
    <div className="single">
      {loading ? (
        <SkewLoader className="loader" color="#87CEEB" />
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="single-details">
          <div className="single-left">
            {product && (
              <div key={product.id} className="single-card">
                <img src={product.image.large} alt={product.name} />
                <h1>{product.id}</h1>
                <p>{firstParagraph}.</p>
                <div className="money">
                  <h4>Rank: <span>{product.market_cap_rank}</span></h4>
                  <h4>Current Price: <span>{product.market_data.current_price.usd}</span></h4>
                  <h4>Market Cap: <span>{product.market_data.market_cap.usd}</span></h4>
                </div>
              </div>
            )}
          </div>
          <div className="single-right">
            <CryptoChart />
          </div>
        </div>
      )}
    </div>
  );
}

export default Single;
