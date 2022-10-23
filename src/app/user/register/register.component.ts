import { Component} from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  constructor (private auth:AuthService, private emailTaken:EmailTaken) {
  }
  inSubmission = false;

  name = new FormControl('', [Validators.required, Validators.minLength(3)])
  email = new FormControl('' , [Validators.required, Validators.email], [this.emailTaken.validate])
  age = new FormControl <number | null> (null , [Validators.required, Validators.min(18), Validators.max(120)])
  password = new FormControl('' , [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])
  confirmPassword = new FormControl('' , [Validators.required])
  phoneNum = new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)])

  registerForm = new FormGroup({
    name : this.name, 
    email :  this.email,
    age : this.age,
    password :this.password,
    confirmPassword :this.confirmPassword,
    phoneNum : this.phoneNum
  }, [RegisterValidators.match('password', 'confirmPassword')]);

  showAlert = false
  alertMessage = "Wait, your account is being created"
  alertColor = "blue"
 
 
  async register (){
  this.showAlert = true;
  this.alertMessage = "Wait, your account is being created";
  this.alertColor = "blue";
  this.inSubmission = true;
  
  
  try {
    await this.auth.createUser(this.registerForm.value as IUser)
  }
  catch (e) {
    console.log(e)
    this.alertMessage = "Bad stuff"
    this.alertColor = 'red'
    this.inSubmission = false
    return
  }
  this.alertColor = 'green'
  this.alertMessage = "Success"
 }
}
