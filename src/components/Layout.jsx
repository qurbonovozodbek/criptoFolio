import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { BiExit } from "react-icons/bi";

function Layout() {
  const [openList, setOpenList] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let item = localStorage.getItem("items");
    let items = item ? JSON.parse(item) : [];
    setData(items);
  }, [openList]);

  const openWatchList = () => {
    if (openList) {
      setOpenList(false);
    } else {
      setOpenList(true);
    }
  };


  function handleExit() {
    setOpenList(true);
  }
  function handleDelete(e) {
    console.log(e);
    let item = localStorage.getItem("items");
    let items = item ? JSON.parse(item) : [];
    items = items.filter((item) => {
      return item.id !== e;
    });
    localStorage.setItem("items", JSON.stringify(items));
    setData(items);
  }

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (event.target.closest('#myButton')) {
        setOpenList(true)
      } else{
        setOpenList(false)
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <div className="container">
      <header>
        <img src={logo} alt="logo" />
        <button onClick={openWatchList} id="myButton">WATCH LIST</button>
        {openList ? (
          <div className="watch-list" id="myButton">
            <div className="exit" onClick={handleExit}>
              {" "}
              <BiExit />{" "}
            </div>
            <h3>WATCHLIST</h3>
            <div className="watch-list-body">
              {data.map((item) => {
                return (
                  <div className="watch-list-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.current_price}</p>
                    <button onClick={() => handleDelete(item.id)}>
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </header>
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default Layout;
