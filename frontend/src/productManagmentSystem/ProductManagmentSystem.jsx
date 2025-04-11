import React, { useEffect, useState } from "react";
import "./productManagmentSystem.scss";
import axios from "axios";
export default function ProductManagmentSystem() {
  const [productData, setProductData] = useState([]);
  const [mode, setMode] = useState("create");
  const [inpData, setInpData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
  });
  const [isLoading, setLoading] = useState(true);

  const emptyInputs = () => {
    setInpData({
      id: "",
      name: "",
      price: "",
      description: "",
    });
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      let myresponse = await fetch("http://localhost:2000/product");
      myresponse = await myresponse.json();
      setProductData(myresponse.result);
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };
  const collectData = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    // Convert value to number if key is 'price'
    if (key === "price") {
      value = parseFloat(value) || 0; // fallback to 0 if input is invalid
    }

    let newObj = { ...inpData };
    newObj[key] = value;
    setInpData(newObj);
    console.log(newObj);
  };

  const sendData = async (e) => {
    e.preventDefault();

    if (
      inpData.name === "" ||
      inpData.description === "" ||
      inpData.price === ""
    ) {
      return alert("Please Fill All Data");
    }
    try {
      if (inpData.price === 0) {
        return alert("Not valid price");
      }

      let myresponse = await axios.post(
        "http://localhost:2000/product",
        inpData
      );
      fetchData();
      console.log(myresponse);
    } catch (error) {
      console.log(error);
    } finally {
      emptyInputs();
    }
  };

  const handleDelete = async (product) => {
    const id = product.id;
    try {
      let myRespons = await axios.delete(`http://localhost:2000/product/${id}`);
      console.log(myRespons);
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const changeMode = (product) => {
    const id = product.id;
    console.log(product);
    setInpData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setMode("update");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let myResponse = await axios.patch(
        `http://localhost:2000/product/${inpData.id} `,
        inpData
      );
      console.log(myResponse);
      await fetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setMode("create");
      emptyInputs();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container1">
      <h1>Product Managment System</h1>
      <form className="inputs">
        <input
          onChange={collectData}
          value={inpData.name}
          name="name"
          type="text"
          placeholder="Product Name."
        />
        <input
          onChange={collectData}
          name="price"
          type="text"
          placeholder="Product Price."
          value={inpData.price}
        />
        <input
          onChange={collectData}
          name="description"
          value={inpData.description}
          type="text"
          placeholder="Product Short Description."
        />
        {mode === "create" ? (
          <button onClick={sendData}>Add Product</button>
        ) : (
          <button onClick={handleUpdate}>Update</button>
        )}
      </form>
      {/* Data  */}
      <div className="data">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Descripion</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          {isLoading ? (
            productData.map((product, index) => (
              <tbody key={product.id}>
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.description} </td>
                  <td>
                    <button
                      onClick={() => handleDelete(product)}
                      className="deleteBtn"
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => changeMode(product)}
                      className="updateBtn"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td>Loading</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
