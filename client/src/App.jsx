import { useEffect, useState } from 'react'

function App() {
  
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {

    fetch("http://localhost:5000/api/health")
    .then((response) => response.json())
    .then((data) => {
      setBackendMessage(data.message);
    })
    .catch((error) => {
      console.error("Error connecting to backend : ", error);
    });

  }, []);
  return (

    <div className='container mt-5 text-center'>
      <h1 className='text-primary'> MedOps</h1>
      
      <p className='lead'>Hospital Operations and Patient Flow Platform</p>

      <div className='mt-4'>

        {backendMessage ? (
          <div className='alert alert-success'> {backendMessage}</div>
        ) :(

          <div className='alert alert-warning'> 
              connecting to backend
          </div>
        )
      
      }
      </div>

    </div>
  )
}

export default App
