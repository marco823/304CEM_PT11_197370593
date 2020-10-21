/* fav.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/
var login = new Vue({
	el: '#main',
	data: {
		recipes: [],
		username: '',
		newPassword: '',
		newRepeatPassword: '',
	    show:false,
	    have:false
	},
	mounted: function() {
		var _this = this;
		var username = sessionStorage.username;
		if (username == null && typeof(username) == 'undefined') {
			alert('Please login...');
			location.href = '/login'
			return;
		}
		_this.username = username;
		_this.initRecipes();
		_this.show = true;
	},
	methods: {
		initRecipes: function(categoryName) {
				var _this = this;
			$.ajax({
				type: "post",
				url: "/findfavoritebyusername",
				data: {
					'username': _this.username
				},
				success: function(data) { 
					_this.recipes=new Array();
					data = JSON.parse(data);
					for(var i=0;i<data.length;i++)
					{
						_this.recipes.push(data[i][0])
					}
				}
			});
		},
		updatePassword: function() {
			console.log("updatePassword");
			var _this = this; 

			_this.newPassword = "";
			_this.newRepeatPassword = "";
			$('#newPassword').modal('show')
		}
		,newPasswordAction: function() {
			
			console.log("newPasswordAction");
			var _this = this;

			if (_this.newPassword == '' || _this.newRepeatPassword == "" || _this.newPassword != _this.newRepeatPassword) {
				alert('Please enter a valid password');
				return;
			}
			var param = {
				'password': _this.newPassword,
				'username': _this.username
			}

			$.ajax({
				type: "put",
				url: "/updatePassword",
				data: param,
				success: function(data) { 
					if (data == 'success') {
						alert("Success to change passwword");
						$('#newPassword').modal('hide')
					} else {
						alert("Fail to change password")
					}
				}
			});

		},
		logout:function()
		{
			sessionStorage.username=null;
			sessionStorage.removeItem('username');
			location.href = '/index';
		},
		showDetail: function(item) {
			var _this = this;
			location.href = '/detail?name=' + item.name+'&recipesId='+item.uuid
		}
	},
	
});
