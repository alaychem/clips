import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  inLogging = false;

  credentials = {
    email : '',
    password : ''
  }

  showAlert = false
  alertMessage = "Logging in..."
  alertColor = "blue"

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {
    
  }

  async login () {
    try{
      this.showAlert = true;
      this.alertMessage = "Logging in";
      this.alertColor = "blue";
      this.inLogging = true;
        await this.auth.signInWithEmailAndPassword(
          this
          .credentials.email, this.credentials.password
        )
    }
    catch(e) {
      console.log(e)
      this.alertMessage = "Somthing went wrong"
      this.alertColor = 'red'
      this.inLogging = false
      return
    }

    this.alertMessage = "Hello";
    this.alertColor = "green";
  }
}
