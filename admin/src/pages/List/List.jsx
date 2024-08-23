import React, { useEffect, useState } from 'react'; // eslint-disable-line no-unused-vars
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const url = 'http://localhost:4000';
  const [list, setList] = useState([]);

  
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching the list');
      }
    } catch (error) {
      toast.error('An error occurred while fetching the list');
      console.error('Fetch list error:', error);
    }
  };

 
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      await fetchList();
      if (response.data.success) {
         toast.success(response.data.message)

      } else {
        toast.error('Error removing the food item');
      }
    } catch (error) {
      toast.error('An error occurred while removing the food item');
      console.error('Remove food error:', error);
    }
  };

  
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          const imageUrl = `${url}/images/${item.image}`; // Ensure this path is correct
          return (
            <div key={index} className='list-table-format'>
              <img src={imageUrl} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
