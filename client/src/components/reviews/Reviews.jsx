import React from 'react';
import "./Reviews.css";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest.js";
import Review from '../review/Review.jsx';

const Reviews = ({gigId}) => {
  const queryClient = useQueryClient();
  const {isLoading, error, data} = useQuery({
      queryKey: ["reviews"],
      queryFn: () => newRequest.get(`/reviews/${gigId}`).then(res => {
        return res.data
      })
  });


  // USING USEMUTATION HOOK IN REACT YOU CAN MAKE A POST REQ
  // MUTATION IS TYPICALLY USED FOR CRUD OR TO PERFORM SERVER SIDE EFFECTS

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post(`/reviews`, review)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"])
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    const desc = e.target[0].value;
    const star = e.target[1].value;

    mutation.mutate({gigId, desc, star})
  }

  return (
    <div className="reviews">
              <h2>Reviews</h2>

              {isLoading ? "loading" : error ? "Something wet wrong" : (
                data.map(review => 
                  <Review key={review._id} review={review} />
                )
              )}

              <div className='add'>
                    <h3>Add a Review</h3>
                    <form action="" className='addForm' onSubmit={handleSubmit}>
                        <input type="text" placeholder='Write your Opinion' />
                        <select name="" id="">
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                        <button>Send</button>
                    </form>
              </div>

            </div>
  )
}

export default Reviews


{/* <div className="item">
                <div className="user">
                  <img
                    className="pp"
                    src="https://images.pexels.com/photos/839586/pexels-photo-839586.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt=""
                  />
                  <div className="info">
                    <span>Garner David</span>
                    <div className="country">
                      <img
                        src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png"
                        alt=""
                      />
                      <span>United States</span>
                    </div>
                  </div>
                </div>
                <div className="stars">
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <span>5</span>
                </div>
                <p>
                  I just want to say that art_with_ai was the first, and after
                  this, the only artist Ill be using on Fiverr. Communication
                  was amazing, each and every day he sent me images that I was
                  free to request changes to. They listened, understood, and
                  delivered above and beyond my expectations. I absolutely
                  recommend this gig, and know already that Ill be using it
                  again very very soon
                </p>
                <div className="helpful">
                  <span>Helpful?</span>
                  <img src="/img/like.png" alt="" />
                  <span>Yes</span>
                  <img src="/img/dislike.png" alt="" />
                  <span>No</span>
                </div>
              </div>
              <hr />
              <div className="item">
                <div className="user">
                  <img
                    className="pp"
                    src="https://images.pexels.com/photos/4124367/pexels-photo-4124367.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt=""
                  />
                  <div className="info">
                    <span>Sidney Owen</span>
                    <div className="country">
                      <img
                        src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e9-1f1ea.png"
                        alt=""
                      />
                      <span>Germany</span>
                    </div>
                  </div>
                </div>
                <div className="stars">
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <span>5</span>
                </div>
                <p>
                  The designer took my photo for my book cover to the next
                  level! Professionalism and ease of working with designer along
                  with punctuality is above industry standards!! Whatever your
                  project is, you need this designer!
                </p>
                <div className="helpful">
                  <span>Helpful?</span>
                  <img src="/img/like.png" alt="" />
                  <span>Yes</span>
                  <img src="/img/dislike.png" alt="" />
                  <span>No</span>
                </div>
              </div>
              <hr />
              <div className="item">
                <div className="user">
                  <img
                    className="pp"
                    src="https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt=""
                  />
                  <div className="info">
                    <span>Lyle Giles </span>
                    <div className="country">
                      <img
                        src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png"
                        alt=""
                      />
                      <span>United States</span>
                    </div>
                  </div>
                </div>
                <div className="stars">
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <span>5</span>
                </div>
                <p>
                  Amazing work! Communication was amazing, each and every day he
                  sent me images that I was free to request changes to. They
                  listened, understood, and delivered above and beyond my
                  expectations. I absolutely recommend this gig, and know
                  already that Ill be using it again very very soon
                </p>
                <div className="helpful">
                  <span>Helpful?</span>
                  <img src="/img/like.png" alt="" />
                  <span>Yes</span>
                  <img src="/img/dislike.png" alt="" />
                  <span>No</span>
                </div>
              </div> */}