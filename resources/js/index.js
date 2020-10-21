/* index.js
Student Name : Lam Wing Lung
Student No : 197370593 (Part Time 11)
Course ID : 304CEM
*/

var login = new Vue({
	el: '#main',
	data: {
		category: [],
		categoryName: '',
		recipes: [],
		newCategoryName: '',
		categoryType: 0,
		oldCategoryName: '',
		newPassword: '',
		newRepeatPassword: '',
		username: '',
		newSubscribeName: '',
		show: false
	},
	mounted: function() {
		var _this = this;

		var username = sessionStorage.username;
		if (username != null && typeof(username) != 'undefined') {
			_this.show = true;
		}else
		{
			_this.show = false;
		}
		_this.initCategory();
		_this.username = username;


	},
	methods: {
		initCategory: function() {
			var _this = this;
			$.ajax({
				type: "get",
				url: "/initCategory",
				success: function(data) { 
					_this.category = JSON.parse(data);
					if (_this.category.length > 0) {
						_this.categoryName = _this.category[0].name;
						_this.initRecipes(_this.categoryName);
					}
				}
			});
		},
		initRecipes: function(categoryName) {

			var _this = this;
			var username = sessionStorage.username;
			_this.categoryName = categoryName;
			_this.postBy = username;
			$.ajax({
				type: "get",
				url: "/initRecipes",
				data: {
					'categoryName': _this.categoryName,
					'postBy': _this.postBy
				},
				success: function(data) { 
					_this.recipes = JSON.parse(data);
					$("li").each(function() {
						$(this).removeClass('categoryLiSelcted');
						if ($(this).attr('name') == _this.categoryName) {
							$(this).addClass('categoryLiSelcted');
						}
					});
				}
			});

		},
		addNewRecipes: function() {
			var _this = this;
			$('#categoryName').val(_this.categoryName)
			$('#postBy').val(_this.postBy)
			$('#addNewRecipes').modal('show')
		},
		addNewCategory: function() {
			var _this = this;
			_this.newCategoryName = "";
			$('#addNewCategory').modal('show')
		},
		updateCategory: function(item) {
			var _this = this;
			debugger;
			_this.categoryType = 1;
			_this.newCategoryName = item.name;
			_this.oldCategoryName = item.name;
			$('#addNewCategory').modal('show')
		},
		addNewCategoryAction: function() {
			var _this = this;
			var param = {
				'name': _this.newCategoryName
			}
			if (_this.newCategoryName == "") {
				alert("Please fill up Category Name");
				return;
			}

			var url = '/addNewCategoryAction';
			var type = 'post';
			if (_this.categoryType == 1) {
				url = 'updateCategoryAction',
					param = {
						'name': _this.newCategoryName,
						'oldName': _this.oldCategoryName
					}
				type = 'put';
			}
			$.ajax({
				type: type,
				url: url,
				data: param,
				success: function(data) {
					if (data == 'success') {
						alert("Success to Add Category");
						$('#addNewCategory').modal('hide')
						_this.initCategory();
					} else {
						alert("Fail to Add Category")
					}
				}
			});
		},
		deCategory: function(name) {
			var _this = this;
			var truthBeTold = window.confirm("Are you confirm to delete?");
			var param = {
				'name': name
			}
			if (truthBeTold) {
				$.ajax({
					type: "delete",
					url: "/deCategory",
					data: param,
					success: function(data) { 
						if (data == 'success') {
							alert("Success to delete");
							_this.initCategory();
						} else {
							alert("Fail to delete")
						}
					}
				});
			}

		},
		delRecipes: function(name) {
			var _this = this;
			var truthBeTold = window.confirm("Are you confirm to delete?");
			var param = {
				'name': name,
				'categoryName': _this.categoryName
			}
			if (truthBeTold) {
				$.ajax({
					type: "delete",
					url: "/delrecipes",
					data: param,
					success: function(data) { 
						if (data == 'success') {
							alert("Success to delete");
							location.href = '/index';
						} else {
							alert("Fail to delete")
						}
					}
				});
			}

		},
		addNewSubscribeAction: function() {
			var _this = this;
			var param = {
				'name': _this.newSubscribeName
			}
			if (_this.newSubscribeName == "") {
				alert("Please fill up your email address");
				return;
			}


			var url = '/addNewSubscribeAction';
			var type = 'post';

			$.ajax({
				type: type,
				url: url,
				data: param,
				success: function(data) {
					if (data == 'success') {
						alert("Success to Add Subscribe");
						//$('#addNewCategory').modal('hide')
						_this.initCategory();
					} else {
						alert("Fail to Add Subscribe")
					}
				}
			});
		},
		updatePassword: function() {
			var _this = this;
			_this.newPassword = "";
			_this.newRepeatPassword = "";
			$('#newPassword').modal('show')
		},
		newPasswordAction: function() {
			var _this = this;

			if (_this.newPassword == '' || _this.newRepeatPassword == "" || _this.newPassword != _this.newRepeatPassword) {
				alert('Please enter correct password');
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
						alert("Success to change password");
						$('#newPassword').modal('hide')
					} else {
						alert("Fail to change password")
					}
				}
			});

		},
		showDetail: function(item) {
			var _this = this;
			location.href = '/detail?name=' + item.name + '&recipesId=' + item.uuid
		},
		skipF: function(item) {
			var _this = this;
			location.href = '/fav'
		},
		addNewRecipesForm: function() {

			var newName = $("#newName").val();
			var newFormula = $("#newFormula").val();
			var newFile = $("#newFile").val();
			var activeTime = $("#activeTime").val();
			var totalTime = $("#totalTime").val();
			var yield = $("#yield").val();
			if (newName == "" || newFormula == "" || newFile == "" || activeTime == "" || totalTime == "" || yield == "") {
				alert("Please fill in the form");
				return
			}


			var _this = this;
			var options = {
				url: "/addNewRecipes",
				type: 'post',

				success: function(res) {
					if (res == "success") {
						alert("Success to add new recipes")
						_this.initRecipes(_this.categoryName);
						
						$('#addNewRecipes').modal('hide');
					}
				}
			}
			$('#fileForm').ajaxSubmit(options);
		},
		logout:function()
		{
			sessionStorage.username=null;
			sessionStorage.removeItem('username');
			location.href = '/index';
		},
				login:function()
		{
			sessionStorage.username=null;
			sessionStorage.removeItem('username');
			location.href = '/login';
		},
			  register:function()
	  {
		  location.href='/register'
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
