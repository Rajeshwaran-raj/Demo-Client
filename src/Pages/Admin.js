import React, { useEffect, useState } from 'react';
import axios from '../Axios/Axios';
import ImageDownloadButton from './ImageDownloadButton'; // Import the new component

export const Admin = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("admin").then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">Data Table</h1>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Email</th>
            <th>Image URL</th>
            <th>Name</th>
            <th>Number</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.email}</td>
              <td>
                <img src={item.imageurl} alt={item.name} width="50" height="50" />
              </td>
              <td>{item.name}</td>
              <td>{item.number}</td>
              <td>
                {/* Use the ImageDownloadButton component */}
                <ImageDownloadButton imageUrl={item.imageurl} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
