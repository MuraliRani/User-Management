import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", department: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      const usersWithDepartment = response.data.map((user) => ({
        ...user,
        department: user.department || "N/A",
      }));
      setUsers(usersWithDepartment);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or edit user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
        setUsers((prev) =>
          prev.map((user) => (user.id === formData.id ? { ...formData } : user))
        );
      } else {
        const response = await axios.post(API_URL, formData);
        setUsers((prev) => [...prev, response.data]);
      }
      setFormData({ id: "", name: "", email: "", department: "" });
      setIsEditing(false);
    } catch (error) {
      setError("Failed to save user. Please try again.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      setError("Failed to delete user. Please try again.");
    }
  };

  // Handle edit action
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      department: user.department || "", // Default to empty if missing
    });
    setIsEditing(true);
  };

  return (
    <div className="app">
      <h1>User Management</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? "Update User" : "Add User"}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
