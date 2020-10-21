/* index.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/
var login=new Vue({
  el: '#main',
  data: {
    username: '',
    password:''
  },
  mounted:function()
  {
      var _this = this;
  },
  methods: {
	  login:function()
	  {
		  var _this = this;
		  var username = this.username;
		  var password= this.password;
		  // alert(username+password);
		  // return
		  if(username==null||password==null)
		  {
			  alert("Please fill up all fields");
			  return
		  }

		  var regEn = /[`~#$%^&*()+<>?:"{},.\/;'[\]]/im;

		  if(regEn.test(username)) 
		  {
			    alert("Special characters in username or password");
			    return ;
		  }
		  var param={'username':username,'password':password}
		  $.ajax({
				type : "post",
				url : "/login", 
				data:param,
				success : function(data) {
					if(data=='success')
					{
						
						sessionStorage.username=username;
						location.href='/index'
					}else
					{
						alert("Wrong username or password")
					}
				}
			});
	  },
	  register:function()
	  {
		  location.href='/register'
	  }
  }
});



