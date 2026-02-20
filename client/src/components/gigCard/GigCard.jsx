import React from "react";
import "./GigCard.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {

  const {isLoading, error, data, refetch} = useQuery ({
    queryKey: [`${item.userId}`],
    queryFn: () => newRequest(`/users/${item.userId}`)
    .then(res => res.data)
  })

  console.log(data);

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
        {
          isLoading ? "loading" : error ? "Something went wrong" : (
            <div className="user">
            <img src={item.img || "/img/noavatar.jpg"} alt="" />
            <span>{item.username}</span>
          </div>
          )
        }
          
          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{!isNaN(item.totslStars / item.starNumber) && Math.round(item.totslStars / item.starNumber)}</span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              $ {item.price}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
