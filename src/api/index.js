import axios from 'axios'; 

const API_URL = "http://localhost:3000"
//controller auth/logoutAccount
export const ApiTemplate = async (method, route, formData) => {
    switch(method.toLowerCase()) {
      case 'get':
        return await axios.get(`${API_URL}/${route}`, { params: formData });
  
      case 'post':
        return await axios.post(`${API_URL}/${route}`, formData);
  
      case 'patch':
        return await axios.patch(`${API_URL}/${route}`, formData);
  
      case 'delete':
        return await axios.delete(`${API_URL}/${route}`, { data: formData });
  
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
};

export const ApiGetTemplate = () => {
    
}

export const ApiTokenTemplate = () => {
    
}