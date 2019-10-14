$(function(){
	$('button').click(function(){
		var user = $('#inputUsername').val();
		var pass = $('#inputPassword').val();
		$.ajax({
			url: '/signupuser',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
				var details = JSON.parse(response);
				if (details.user) {
					console.log(response);
					if (details.status == "OK"){
						var successmsg = "Congratulations on registering for CSE6242, " + details.user + "! Redirecting you to the course homepage...";
						document.getElementById("regsuccess").innerHTML = successmsg;
						document.getElementById("signupform").reset();
						setTimeout(function(){ window.location.href = "http://poloclub.gatech.edu/cse6242/" }, 3000);						
					}
					else {
						var badmssg = user + ", the password is invalid because it";
						
						for (var i = 0; i < details.pass.length; i++){
							if (details.pass[i] == 1)
								badmssg = badmssg + ", 1. Should be at least 8 characters in length ";
							if (details.pass[i] == 2)
								badmssg = badmssg + ", 2. Should have at least 1 uppercase character ";
							if (details.pass[i] == 3)
								badmssg = badmssg + ", 3. Should have at least 1 number ";
						}
						badmssg = badmssg + ". Please Try Again!"
						document.getElementById("regsuccess").innerHTML = badmssg;
						document.getElementById("inputPassword").value = "";
					}
				}

			},
			error: function(error){
				console.log(error);
			}
		});
	});
});
