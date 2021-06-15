import classes from './AvailableMeals.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem'
import {useEffect, useState} from 'react'


const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsloading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=> {
    const fetchMeals = async() => {
      const response = await fetch('https://react-http-522f7-default-rtdb.firebaseio.com/meals.json')
      
      if (!response.ok) {
        throw new Error('something went wrong');
      }

      const loadedMeals = []

      const data = await response.json()

      for (const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price
        })
      }
      setMeals(loadedMeals);
      setIsloading(false)
    }


    fetchMeals().catch((error)=>{
      setIsloading(false);
      setError(error.message)
    })
  }, [])

  if(isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading.....</p>
      </section>
    )
  }

  if(error) {
    return (
      <section className={classes.MealsError}>
        <p>{error}</p>
      </section>
    )
  }

  const mealsList = meals.map(el => 
    <MealItem 
    id={el.id}
    key={el.id} 
    name={el.name} 
    price={el.price} 
    description={el.description}/>
  );

  

  return (
    <section className={classes.meals}>
      <Card>
        <ul>
          {mealsList}
        </ul>
      </Card>
    </section>
    
  )
}

export default AvailableMeals;