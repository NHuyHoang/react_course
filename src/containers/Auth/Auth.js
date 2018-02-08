import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css'
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux'
class Auth extends Component {
    state = {
        loginForm : {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            pass: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your password'
                },
                value: '',
                validation: {
                    minLength: 7
                },
                valid: false,
                touched: false
            }
        }
    } 

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedLoginForm = {
            ...this.state.loginForm
        };
        const updatedLoginElement = { 
            ...updatedLoginForm[inputIdentifier]
        };
        updatedLoginElement.value = event.target.value;
        updatedLoginElement.valid = this.checkValidity(updatedLoginElement.value, updatedLoginElement.validation);
        updatedLoginElement.touched = true;
        updatedLoginForm[inputIdentifier] = updatedLoginElement;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedLoginForm) {
            formIsValid = updatedLoginForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({loginForm: updatedLoginForm, formIsValid: formIsValid});
    }

    
    submitHandler = (event) =>{
        event.preventDefault();
        this.props.onAuth(this.state.loginForm.email.value, this.state.loginForm.pass.value);
    }    

    render(){
        let formElementsArray = [];
        for(let key in this.state.loginForm){
            formElementsArray.push({
                    id: key,
                    config: this.state.loginForm[key]
            })
        }
        
        let loginInputs = (
            <form onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>SUBMIT</Button>
            </form>
        )
        
        return(
            <div className={classes.Auth}>
                {loginInputs}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email,pass) => dispatch(actions.auth(email,pass)),
    }
    
}

export default connect(null,mapDispatchToProps)(Auth);