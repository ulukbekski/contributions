import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const shortedMonth = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('en', { month: 'short' }) + '.'
);
const WeekDays = ['Mon.','Wed.','Fri.'];




const Box = ({ num, date, isActive, onClick }) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const bg = num < 1 ? "gray" : num < 10 ? "lightBlue" : num < 20 ? "blue" : num < 30 ? "darkBlue" : "darkerBlue";

  if (num < 1) num = "No";

  const formattedDate = new Date(date);
  return (
    <div className={`box ${bg} ${isActive ? "borders" : ""}`} onClick={onClick}>
      {isActive && (
        <div className="modal">
          <h4>{num} contributions</h4>
          <p>
            {daysOfWeek[formattedDate.getDay()]}, {months[formattedDate.getMonth()]} {formattedDate.getDate()}, {formattedDate.getFullYear()}
          </p>
        </div>
      )}
    </div>
  );
};

function Contributions({currentYear}) {
  const [active, setActive] = useState([]);
  const [datas, setDatas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  
  
  function Nothing() {
    const newdate = new Date(currentYear,0,1).getDay()
  
    const noth = new Array(newdate).fill(0)
    const noths = noth.map((a,i) => <div key={a+i} className='box transparent'></div>)
    return noths
  }
  
  

  function getDaysInYear() {
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
    return isLeapYear ? 366 : 365; // Возвращаем 366 дней для високосного года, иначе 365
  }


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

  const createObject = () => {
    const obj = {};
    let date = new Date(currentYear,0,1,4);
    for (let i = 0; i < getDaysInYear(); i++) {
      const dateString = date.toISOString().slice(0, 10);

      obj[dateString] = 0;
      date.setDate(date.getDate() + 1 );
      
    }

    return obj;
  };

  

  const dars = Object.entries(createObject()).map(([key, value]) => [key, datas[key] || value]);

  return (
    <div className="con">
      <div className="months">
        {shortedMonth.map((month, index) => <li key={index}>{month}</li>)}
      </div>
      <div className="grid-wrapper flex">
        <div className="weeks">
          {WeekDays.map((day, index) => <li key={index}>{day}</li>)}
        </div>
        <div className="grid">
          {<Nothing/>}
          {dars.map(([date, num], index) => (
            <Box
              key={index}
              num={num}
              date={date}
              isActive={active[index]}
              onClick={() => setActive(Array(getDaysInYear()).fill(false).map((_, i) => i === index))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contributions;
