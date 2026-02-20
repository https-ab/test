import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "image_project"); // make sure this is the exact preset name from Cloudinary

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/ds6rnde1h/image/upload",
      data
    );

    // secure_url is already a string
    return res.data.secure_url;
  } catch (err) {
    console.log("Upload error:", err.response ? err.response.data : err.message);
  }
};

export default upload;
