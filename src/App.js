import React from 'react'
import './App.css';

import axios from 'axios';
const shortedMonths = [ "Янв", "Февр", "Март","Апр", "Май","Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек" ]
const WeekDays = ["Пн", "Ср", "Пт"]


const Box = ({ num, date }) => {

  const [active, setActive] = React.useState(false)

  date = new Date(date)
  const daysOfWeek = [ "Воскресенье","Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const bg = num < 1 ? "gray" :
    num < 10 ? "lightBlue" :
      num < 20 ? "blue" :
        num < 30 ? "darkBlue" : "darkerBlue"
  if(num < 1){num = "No"}
  return (<div className={`box ${bg} ${active && "borders"}`} onClick={() => setActive(!active)}>
    {active && <div className='modal'>
      <h4>{num} contributions</h4>
      <p>{daysOfWeek[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
    </div>}
  </div>)
}



function App() {
  const [datas, setD] = React.useState({})
  function getMonday(date) {
    date = new Date(date)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // вычисляем разницу между днем недели и датой

    return new Date(date.setDate(diff));
  }
  
  function createObject(startDate) {
    const obj = {};
    let date = new Date(getMonday(startDate)); // начальная дата
    for (let i = 0; i < 357; i++) {
      const dateString = date.toISOString().slice(0, 10); // преобразуем дату в строку формата "гггг-мм-дд"
      obj[dateString] = 0; // устанавливаем значение для ключа
      date.setDate(date.getDate() + 1); // переходим к следующему понедельнику
    }
    return obj;
  }
  
  function splitArrayIntoChunks(arr) {
    const chunkSize = 7;
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

 
  
  React.useEffect(()=>{ 
    axios.get('https://6392e59c11ed187986a3e9ce.mockapi.io/example')
    .then(res => setD(res.data[0]))
  },[])
  if(Object.values(datas)[0]){
    const data = Object.entries(datas)
    let dars = createObject(data[0][0])
    dars = Object.entries(dars)
    dars = dars.map(obj => [obj[0], datas[obj[0]] || 0])
    const dat = new Date(dars[0][0]).getMonth()
    const shortedMonth = [...shortedMonths.slice(dat), ...shortedMonths.slice(0, dat)]
    console.log(shortedMonths.slice(dat))
  const dayso =  splitArrayIntoChunks(dars)
  .map((obj, index) => <div key={index}>{
  obj.map((obj, index) => <Box key={index} num={obj[1]} date={obj[0]} />)
  }</div>)
  
  return (
    <div className='App'>
      <div className='months'>
        {shortedMonth.map(obj => <li key={obj}>{obj}</li>)}
      </div>
      <div className='grid-wrapper flex'>
        <div className='weeks'>
          {WeekDays.map(obj => <li key={obj}>{obj}</li>)}
        </div>
        <div className="flex">
          {dayso}
        </div>

      </div>
    </div>
  );}
}

export default App;
