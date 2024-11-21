import React from 'react'
import Contributions from './Contributions'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Button } from '@mui/material'

 

export default function App() {
  const [datas, setDatas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  useEffect(() => {
    axios.get('https://5b983ecb01a7378e.mokky.dev/push')
      .then(res => {
        setDatas(res.data[0]);
        setIsLoading(false);    
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  const func = () => {
    const keys = Object.keys(datas)
    let x = new Date(keys[0]).getFullYear()
    let y = new Date().getFullYear()
    const buttons = []
    let i = 0
    for(x; x<=y;x++){
      i++
      buttons.push({year:x,id:i})
    }
    return buttons
  }
  


 

  return (
    <div className='App'>
      <Contributions currentYear={currentYear}/>
      <div className='years' >
        {func().map(({year,id}) =><Button sx={{m:0.5}} size='large' onClick={()=> setCurrentYear(year)} variant={year==currentYear?"contained":'outlined'}>{year}</Button>  )}
      </div>

    </div>
  )
}
