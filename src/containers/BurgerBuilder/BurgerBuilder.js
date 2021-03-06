import React,{Component} from 'react';
import Aux from '../../hoc/Au/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    'salad': 0.3,
    'cheese': 0.4,
    'meat': 1.3,
    'bacon': 0.3
}

class BurgerBuilder extends Component{

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable:false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('https://burger-builder-de672.firebaseio.com/ingredients.json')
        .then(response => {
           this.setState({ingredients: response.data})
        }).catch(error => {
            this.setState({error : true})
        })
    }

    updatePurchasableState(ingredients){
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum,el)=>{
            return sum+el
        },0)
        this.setState({purchasable: sum>0})
    }

    addIngredientHandler = (type) => {
        const oldCount= this.state.ingredients[type]
        const updatedCount = oldCount+1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice =this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchasableState(updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount= this.state.ingredients[type]
        if(oldCount<=0){
            return;
        }
        const updatedCount = oldCount-1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice =this.state.totalPrice
        const newPrice = oldPrice + priceDeduction
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchasableState(updatedIngredients)
    }

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }

    purchaseCancelHandler = ()=> {
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = ()=> {
    //     this.setState({loading:true})

    //    const order = {
    //        ingredients : this.state.ingredients,
    //        price : this.state.totalPrice,
    //        customer : {
    //            name : 'Sudikshaa',
    //            address: 'India',
    //            email: 'test@test.com'
    //        },
    //        deliveryMethod: 'fastest'
    //    }
    //    axios.post('/orders.json',order)
    //    .then(response => {
    //        console.log(response)
    //        this.setState({loading:false,purchasing:false})
    //    }).catch(error => {
    //        console.log(error)
    //     this.setState({loading:false,purchasing: false})

    //    })
    const queryParams = []
    for(let i in this.state.ingredients){
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
    }
    queryParams.push('price=' + this.state.totalPrice)
    const queryString = queryParams.join('&')
    this.props.history.push({
        pathname: '/checkout',
        search: '?' + queryString
    })
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0
        }
        let burger = this.state.error ?  <p>Ingredients can't be loaded</p> : <Spinner/>
        let orderSummary = null
        if(this.state.ingredients){
            burger = <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                   ingredientAdded={this.addIngredientHandler}
                   ingredientDeducted = {this.removeIngredientHandler}
                   disabled = {disabledInfo}
                   price = {this.state.totalPrice}
                   ordered = {this.purchaseHandler}
                   purchasable = {this.state.purchasable}
                />
            </Aux>
            orderSummary =  <OrderSummary ingredients={this.state.ingredients}
            purchaseCancel = {this.purchaseCancelHandler}
            purchaseContinue = {this.purchaseContinueHandler}
            price = {this.state.totalPrice}
            />
        }
        
        if(this.state.loading){
            orderSummary = <Spinner/>
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
               {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);