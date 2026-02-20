import React, { useRef, useState } from "react";
import "./Gigs.css";
// import { gigs } from "../../data";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
function Gigs() {
  //storing the value of sort selected
  // currently we are storing as sales as this would be applied in the API req from backend
  const [sort, setSort] = useState("sales");

  // menu open and close
  const [open, setOpen] = useState(false);

  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['gigs', sort, search],
    queryFn: () => {
      const queryString = `${search ? search + "&" : "?"}min=${minRef.current?.value || 0}&max=${maxRef.current?.value || 999999}&sort=${sort}`;
      return newRequest.get(`/gigs${queryString}`).then(res => res.data);
    },
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    refetch();
    console.log(minRef.current.value);
    console.log(maxRef.current.value);
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          Hirely &gt; Graphics &amp; Design &gt;
        </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Hirely's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong"
            : data?.length > 0
            ? data.map((gig) => <GigCard key={gig._id} item={gig} />)
            : "No gigs found"}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
