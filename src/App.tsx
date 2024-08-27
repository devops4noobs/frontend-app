import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './App.css';


interface FormData {
  name: string;
  age: number;
}

interface User {
  id: number;
  name: string;
  age: number;
}

const baseUrl = 'http://localhost:8080'; 

function App(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: 0
  });

  const [users, setUsers] = useState<User[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Data added successfully');
        await fetchAllUsers(); // Fetch all users after data is added
        // Clear form data after successful submission
        setFormData({ name: '', age: 0 });
      } else {
        console.error('Error adding data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllUsers = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/api/all`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Update the users state with fetched data
      } else {
        console.error('Error fetching users');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAllUsers(); // Fetch users when the component mounts
  }, []);

  return (
    <div className="App">
      <h1>Devops4noobs</h1>
      <h1>Add Data</h1>
      <form onSubmit={handleSubmit}>
        <label>
          User Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h2>All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.age}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
