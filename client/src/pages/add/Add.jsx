import React from "react";
import "./Add.css";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useState } from "react";
import { useReducer } from "react";


const Add = () => {
  // to handle single file upload
  const [singleFile, setSingleFile] = useState(undefined);

  // to handle multiple file upload
  const [files, setFiles] = useState([]);

  // to track uploading process, initiall false and when start uploading it will be true
  const [uploading, setUplaoding] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    e.preventDefault();
    // console.log("e.target.name", e.target.name);
    // console.log("e.target.value", e.target.value);

    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: e.target.name,
        value: e.target.value
      }
    })
  };

  const addFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    if (!singleFile && files.length === 0) {
      alert("Please select files to upload first!");
      return;
    }
  
    setUplaoding(true);
    try {
      const cover = singleFile ? await upload(singleFile) : null;
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
  
      dispatch({
        type: "ADD_IMAGES",
        payload: {
          cover,
          images,
        },
      });
  
      setUplaoding(false);
      alert("Files uploaded successfully!");
    } catch (err) {
      console.log(err);
      setUplaoding(false);
      alert("Upload failed. Try again.");
    }
  };
  
  
  // const handleUpload = async() => {
  //   setUplaoding(true);
  //   try {
  //     const cover = await upload(singleFile);
  //     const images = await Promise.all(
  //       [...files].map(async (file) => {
  //         const url = await upload(file);
  //         return url
  //       })
  //     );

  //     setUplaoding(false);

  //     dispatch({
  //       type: "ADD_IMAGES",
  //       payload: {
  //         cover,
  //         images
  //       }
  //     })

  //   } catch (err) {
  //     console.log(err)
  //   }
  // };

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["myGigs"] });
      navigate("/gig/" + res.data._id);
    },
  });
  

  const handleSubmit = (e) => {
    console.log(state);
    e.preventDefault();
    mutation.mutate(state);
    // navigate("/mygigs");
  };


  // const { isLoading, error } = useQuery(
  //   ["add"],
  //   () =>
  //     newRequest.post("/gigs", state).then((res) => {
  //       navigate("/gig/" + res.data._id);
  //     })
  // );

  return (
    <div className="add" name="add">
      <div className="container" name="container">
        <h1>Add New Gig</h1>
        <div className="sections" name="sections">
          <div className="info" name="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              placeholder="e.g. I will do something I'm really good at"
              name="title"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cats" onChange={handleChange} value={state.cat}>
              <option value="">Select Category</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <label htmlFor="">Cover Image</label>
            <input type="file" onChange={(e) => setSingleFile(e.target.files[0])}/>
            <label htmlFor="">Upload Images</label>
            <input type="file" multiple onChange={(e) => setFiles(e.target.files)}/>
            <button onClick={handleUpload} style={{"width": "50%"}}>
              {uploading ? "Uploading" : "Upload"}
            </button>
            <label htmlFor="">Description</label>
            <textarea name="desc" onChange={handleChange} id="" placeholder="Brief descriptions to introduce your service to customers" cols="0" rows="16"></textarea>
            <button onClick={handleSubmit}>
              Create
            </button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input type="text" name="shortTitle" placeholder="e.g. One-page web design" onChange={handleChange} />
            <label htmlFor="" >Short Description</label>
            <textarea name="shortDesc" id="" placeholder="Short description of your service" cols="30" rows="10" onChange={handleChange}></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange}/>
            <label htmlFor="">Revision Number</label>
            <input type="number" name="revisionNumber" onChange={handleChange}/>

            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={addFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>

            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button onClick={() => dispatch({ 
                    type: "REMOVE_FEATURE", 
                    payload: f, 
                    })}>
                    {f}  <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            {/* <input type="text" placeholder="e.g. page design" />
            <input type="text" placeholder="e.g. file uploading" />
            <input type="text" placeholder="e.g. setting up a domain" />
            <input type="text" placeholder="e.g. hosting" /> */}

            <label htmlFor="">Price</label>
            <input type="number" name="price" onChange={handleChange}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
