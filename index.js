    var config = {
        apiKey: "AIzaSyAOkm7TfMoFwXG7XqsPjd0oFWVGFD11l1I",
        authDomain: "find-meal.firebaseapp.com",
        databaseURL: "https://find-meal.firebaseio.com",
        projectId: "find-meal",
        storageBucket: "",
        messagingSenderId: "255092622982"
    };
    firebase.initializeApp(config);



    function searchOnce(value) {
        firebase.database().ref().child('ingredients').orderByChild('name').startAt(value).endAt(value + "\w|\W").once('value')
            .then(function(dataSnapshot) {
                var k1 = dataSnapshot.val();
                for (var k in k1) {
                    console.log(k1[k].name);
                }
            });
    }


    function fullSearch(value) {
        firebase.database().ref().child('ingredients').orderByChild('name').once('value')
            .then(function(dataSnapshot) {
                var k1 = dataSnapshot.val();
                for (var k in k1) {
                    var textSmall = k1[k].name.toLowerCase();
                    if (textSmall.includes(value.toLowerCase())) {
                        console.log(k1[k].name);
                    }
                }
            });
    }




    function autocomplete(inp) {
        var currentFocus;

        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            firebase.database().ref().child('ingredients').orderByChild('name').once('value')
                .then(function(dataSnapshot) {
                    var arr = dataSnapshot.val();

                    for (i = 0; i < arr.length; i++) {
                        if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            b = document.createElement("DIV");
                            b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                            b.innerHTML += arr[i].name.substr(val.length);
                            b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                            b.addEventListener("click", function(e) {
                                inp.value = this.getElementsByTagName("input")[0].value;
                                var li = document.createElement("li");
                                li.innerText = inp.value
                                document.getElementById("list").appendChild(li);
                                closeAllLists();
                            });
                            a.appendChild(b);
                        }
                    }


                });



        });
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function(e) {
            closeAllLists(e.target);
        });
    }

    autocomplete(document.getElementById("myInput"));