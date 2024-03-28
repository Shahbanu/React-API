import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const View = () => {
  const [view, setViews] = useState({ Id:"",Title: "", Description: "" });
  const { id } = useParams();

  function fetchData() {
    const token = localStorage.getItem("token");
    axios
      .get(`https://testapi.mair.co.ae/api/auth/admin/issueList/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log("Response", response.data.data);
        setViews(res.data.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(()=>{
    fetchData();
  },[])
  //store token in local storage
  return (
    <div>
      <h2>View Title</h2>
     <br></br>
          <div>
          

          <table className="table table-striped">
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Title</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{view.Id}</td>
      <td>{view.Title}</td>
      <td>{view.Description}</td>
    </tr>
  </tbody>
</table>
</div>
    </div>
  );
};
export default View;
