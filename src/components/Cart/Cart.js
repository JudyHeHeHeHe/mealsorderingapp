import React from 'react';
import classes from './Cart.module.css'
import Modal from '../UI/Modal'
import {useContext, useState} from 'react'
import CartContext from '../../store/cart-context'
import CartItem from './CartItem'
import Checkout from './Checkout'

const Cart = (props) => {
	const cartCtx = useContext(CartContext);

	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;

	const hasItems = cartCtx.items.length > 0

	const [isCheckout, setIsCheckout] = useState(false)

	const [isSubmitting, setIsSubmitting] = useState(false)

	const [didSubmit, setDidSubmit] = useState(false)

	const cartItemRemoveHandler = id => {
		cartCtx.removeItem(id)
	}

	const cartItemAddHandler = item => {
		cartCtx.addItem({...item, amount: 1})

	}

	const CheckoutHandler = () => {
		setIsCheckout(true);
	}

	// const cartItems =(
	// 	<ul className={classes['cart-items']}>
	// 		{cartCtx.items.map((el) => (
	// 			<CartItem key={el.id}  name={el.name} amount={el.amount} price={el.price} onRemove={cartItemRemoveHandler.bind(null, el.id)} onAdd={cartItemAddHandler.bind(null, el)}/>))
	// 		}
	//   </ul>
	// );

	const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const submitOrderHandler = async (userData) => {
  	setIsSubmitting(true)

  	await fetch('https://react-http-522f7-default-rtdb.firebaseio.com/orders.json',{
  		method: 'POST',
  		body: JSON.stringify({
  			user: userData,
  			orderItems: cartCtx.items
  		})
  	})

  	setIsSubmitting(false)
  	setDidSubmit(true)
  	cartCtx.clearCart();
  }

  const modalActions = (
  	<div className={classes.actions}>
	  	<button className={classes['button--alt']} onClick={props.onClose}>Close</button>
	  	{hasItems && <button onClick={CheckoutHandler} className={classes.button}>Order</button>}
  	</div>
  )

  const cartModalContent=(
  	<React.Fragment>
  	  {cartItems}
	  	<div className={classes.total}>
	  		<span>Total Amount</span>
	  		<span>{totalAmount}</span>
	  	</div>
	  	{isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
	  	{!isCheckout && modalActions}
    </React.Fragment>)

  const isSubmittingmodalContent = (
  	<p>Sending order data....</p>
  )

  const didSubmitModalContent = (
  	<React.Fragment>
  	  <p>Thank you for your order!</p>
  	  <div className={classes.actions}>
  	    <button className={classes.button} onClick={props.onClose}>Close</button>
  	  </div>
  	</React.Fragment>)

  return (
  	<Modal onClose={props.onClose}>
	  {!isSubmitting && !didSubmit && cartModalContent}
	  {isSubmitting && isSubmittingmodalContent}
	  {didSubmit && !isSubmitting && didSubmitModalContent}
  	</Modal>
  )
}

export default Cart;