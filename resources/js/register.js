/* register.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/
var login = new Vue({
	el: '#main',
	data: {
		username: '',
		password: '',
		birthday: '',
		phone: ''
	},
	mounted: function() {
		var _this = this;
	},

	methods: {
		register: function() {
			var _this = this;
			
			var username = this.username;
			var password = this.password;
			var phone = this.phone;
			if (username =="" || password =="" || phone =="") {
			alert("Please fill up all fields");
			return
			}
			var regEn = /[`~#$%^&*()+<>?:"{},.\/;'[\]]/im;

		  if(regEn.test(username)) 
		  {
			    alert("Special characters in username or password");
			    return ;
		  }
			var param = {
				'username': _this.username,
				'password': _this.password,
				'phone': _this.phone
			}
			
			$.ajax({
				type: "post",
				url: "/findByuserName",
				data: param,
				success: function(data) { 
					if (data == 'success') {
						$.ajax({
							type: "post",
							url: "/register",
							data: param,
							success: function(data) { 
								if (data == 'success') {
									alert("Success to Register");
									location.href = '/index'
								} else {
									alert("Fail to Register");
								}
							}
						});
					}else
					{
						alert('Username already exists!')
					}
				}
			});




		}
	}
});
