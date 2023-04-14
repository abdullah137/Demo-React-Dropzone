import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';
import axios from 'axios';

function App() {

  const [images, setImages] = useState([]);

  function handleUpload() {
    console.log('uploading file...');
    axios.post('http://localhost:4000/upload', {images}).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.error(error.message);
    })
  }

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prevState => [...prevState, {...file, buffer: reader.result}]);
      }
      reader.readAsDataURL(file);
    })
    
  }, []);

  useEffect(() => {
    console.log(images)
  }, [images]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ['image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] });

  return (
    <div className="App">
      <div className='dropzone'  { ...getRootProps()}>
        <input { ...getInputProps() } />
          {isDragActive ? "Drag Active" : "You can drop your files here." }
      </div>
      {images.length > 0 && <div> 

          {images.length > 0 && <button onClick={handleUpload}>Upload Images</button>}
        </div> }
    </div>
  );
}

export default App;
