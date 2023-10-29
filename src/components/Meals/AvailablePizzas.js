import { useEffect, useCallback, useState } from "react";
import Card from "../UI/Card";
import classes from "./AvailablePizzas.module.css";
import PizzaItem from "./PizzaItem/PizzaItem";
import { getMenu } from "../API";

const AvailablePizzas = () => {
  const [menuList, setMenuList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenuHandler = useCallback(async () => {

    if (menuList.length == 0) {
      setIsLoading(true);
      setError(null);

      try {

        const menuResponse = await getMenu();

        if (menuResponse.description) {
          setMenuList([]);
          setError(menuResponse.description);
        } else {
          setError("");
          const loadedMenu = [];

          for (const key in menuResponse) {
            loadedMenu.push({
              id: key,
              name: menuResponse[key].name,
              ingredients: menuResponse[key].description,
              price: menuResponse[key].price,
            });
          }
          setMenuList(loadedMenu);
        }
        
      } catch (error) {
        setMenuList([]);
        setError(error.toString());
      }
      setIsLoading(false);
    }
    
  }, []);

  useEffect(() => {
    fetchMenuHandler();
  }, [fetchMenuHandler]);

  const pizzasList = menuList.map((pizza) => (
    <PizzaItem
      id={pizza.id}
      key={pizza.id}
      name={pizza.name}
      ingredients={pizza.ingredients}
      price={pizza.price}
    />
  ));

  return (
    <section className={classes.section}>
      <Card>
        <ul style={{'color': 'red'}} >{error}</ul>
        <ul>{pizzasList}</ul>
      </Card>
    </section>
  );
};

export default AvailablePizzas;
