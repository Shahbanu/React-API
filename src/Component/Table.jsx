import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {message} from 'antd';

const Table = () => {
  //list of posts
  const [posts, setPosts] = useState([]);
  //current page number
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //whether the modal is displayed
  const [showModal, setShowModal] = useState(false);
  //form data for creating/updating posts
  const [formData, setFormData] = useState({ Title: "", Description: "" });
  //ID for selected post for editing
  const [selectedPostId, setSelectedPostId] = useState(null);
  //store token in local storage
  const token = localStorage.getItem("token");
  //create api
  const URL =
    "https://testapi.mair.co.ae/api/auth/admin/issueList/list?limit=10&page=";
  //used to fetch data from the API when the component mounts ('currentPage' or 'token' changes).
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, token]);
  //This function is responsible for fetching data from the API endpoint based on the current page number.
  const fetchData = (page) => {
    axios
      .get(`${URL}${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
  //Upon a successful response, it updates the posts state variable with the fetched data and sets the totalPages state variable based on the total number of pages returned by the API.
     //promise handling
      .then((res) => {
        setPosts(res.data.data.data);
        setTotalPages(res.data.data.totalPages);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //This function is called when the user clicks on a pagination button to navigate to a different page.
  //It updates the currentPage state variable with the new page number, triggering a re-fetch of data from the API using the useEffect hook
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  //This function generates the pagination buttons based on the totalPages state variable and the current page number
  //It creates a list of <li> elements, each containing a pagination button for a specific page number.
  //The button for the current page is styled differently to indicate the active page.
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };
  //This function toggles the visibility of the modal window for creating/editing posts.
  //It flips the value of the showModal state variable to show or hide the modal.
  const toggleModal = () => {
    setShowModal(!showModal);//This action shows or hides the modal depending on its current state.
    setFormData({ Title: "", Description: "" }); // Reset form data when modal opens/closes
    setSelectedPostId(null); // Clear selected post ID // It's useful for scenarios where the modal is used both for creating new posts and editing existing ones.
  };
  //This function is called when the user types in the input fields of the modal form.
  //It updates the formData state variable with the new values entered by the user.
  //It uses the name attribute of the input field to dynamically update the corresponding property in the formData object.
  const handleInputChange = (event) => {
    const { name, value } = event.target;//The name property corresponds to the name attribute of the input field, and the value property represents the current value entered by the user.
    setFormData({ ...formData, [name]: value });
  };
  //This function is called when the user submits the form in the modal window to create or update a post
  //It constructs the request data based on the formData state variable and sends a POST or PUT request to the API endpoint accordingly.
  //Upon a successful response, it toggles the modal to close it and triggers a re-fetch of data from the API to refresh the table.
  const handleSubmit = () => {
    let requestData = { ...formData };
    const requestUrl = `https://testapi.mair.co.ae/api/auth/admin/issueList/createUpdateIssueList`;

    if (selectedPostId) {
      requestData = { Id: selectedPostId, ...formData };
    }
    axios.post(requestUrl, requestData, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        message.success('Created Successfully',3)//ant.d
        fetchData(currentPage);
         // Refresh table data
      })

      .catch((error) => {
        console.error("Error creating/updating post:", error);
      });
  };
  //This function is called when the user clicks the "Edit" button for a specific post.
  //It retrieves the selected post from the posts array based on its ID and sets the formData state variable with its title and description.
  //It also sets the selectedPostId state variable to the ID of the selected post and opens the modal window for editing.
  const handleEdit = (postId) => {
    const selectedPost = posts.find((post) => post.Id === postId);
    if (selectedPost) {
      setFormData({
        Title: selectedPost.Title,
        Description: selectedPost.Description,
      });
      setSelectedPostId(postId);//This helps in identifying which post is being edited.
      setShowModal(true);
    }
  };

  //This function is called when the user clicks the "Delete" button for a specific post.
  //It sends a DELETE request to the API endpoint to delete the post with the specified ID.
  //Upon a successful response, it updates the posts state variable by filtering out the deleted post from the array
  const handleDelete = (postId) => {
    axios.delete(`https://testapi.mair.co.ae/api/auth/admin/issueList/delete/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      message.success('Deleted Successfully',3)//ant.d
      setPosts(posts.filter(post => post.Id !== postId));
    })
    .catch(error => {
      console.error('Error deleting post:', error);
    });
  };
  return (
    <div style={{ color: "black" }}>
      <button className="btn btn-primary mb-3" onClick={toggleModal}>
        Create
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{post.Id}</td>
              <td>{post.Title}</td>
              <td>{post.Description}</td>
              <td>
              <button type="button" className="btn btn-success" >View</button>&nbsp;&nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => handleEdit(post.Id)}
                >
                  Edit
                </button>&nbsp;&nbsp;&nbsp;
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(post.Id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {renderPagination()}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Item</h5>
                <button
                  type="button"
                  className="close"
                  onClick={toggleModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="Id">Id</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Id"
                    name="Id"
                    placeholder="No required"
                    value={formData.Id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Title"
                    name="Title"
                    value={formData.Title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    className="form-control"
                    id="Description"
                    name="Description"
                    value={formData.Description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Table;
