/* detail.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/
var login=new Vue({
  el: '#main',
  data: {
    repeices: [],
	username:'',
	show:false,
	have:false
  },
  mounted:function()
  {
      var _this = this;
	  _this.init();
	  _this.findFavicate();

  },

  methods: {
	  init:function()
	  {
		  var _this = this;
		  var username = sessionStorage.username;
		  if (username != null && typeof(username) != 'undefined') {
		  	_this.username = username;
			_this.show = true;
		  }
		var name =decodeURI(_this.getQueryVariable('name'));
		if (!name) {
			alert('Access denied, Please login...');
			location.href = '/login'
			return;
		}
		var recipesId =decodeURI(_this.getQueryVariable('recipesId'));
		_this.recipesId = recipesId;
		$.ajax({
			type: "post",
			url: "/initDeatil",
			data: {
				'name': name
			},
			success: function(data) {
				_this.repeices=JSON.parse(data)[0];
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
	  addFavicate:function()
	  {
		   var _this = this;
		  $.ajax({
		  	type: "post",
		  	url: "/addfavorite",
		  	data: {
		  		'username': _this.username,
				'recipesId':_this.recipesId
		  	},
		  	success: function(data) {
				if(data=='success'){
					alert('Added to My List')
					location.reload();
				}
		  	}
		  });
	  },
	  	  removeFavicate:function()
	  {
		   var _this = this;
		  $.ajax({
		  	type: "post",
		  	url: "/removefavorite",
		  	data: {
		  		'username': _this.username,
				'recipesId':_this.recipesId
		  	},
		  	success: function(data) {
				if(data=='success'){
					alert('My List Deleted')
					location.reload();
				}
		  	}
		  });
	  },
	  findFavicate:function()
	  {
	  		   var _this = this;
	  		  $.ajax({
	  		  	type: "post",
	  		  	url: "/isfavorite",
	  		  	data: {
	  		  		'username': _this.username,
	  				'recipesId':_this.recipesId
	  		  	},
	  		  	success: function(data) {
	  				if(JSON.parse(data).length>0){
	  					_this.have=true;
	  				}
	  		  	}
	  		  });
	  },
	  		skipF: function(item) {
			var _this = this;
			location.href = '/fav'
		},
	  getQueryVariable: function(variable) {
	  	var query = window.location.search.substring(1);
	  	var vars = query.split("&");
	  	for (var i = 0; i < vars.length; i++) {
	  		var pair = vars[i].split("=");
	  		if (pair[0] == variable) {
	  			return pair[1];
	  		}
	  	}
	  	return (false);
	  }
  }
});



